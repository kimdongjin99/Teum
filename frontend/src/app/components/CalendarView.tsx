import { useState } from "react";
import { Calendar } from "./ui/calendar";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Plus, Users, LogOut, Calendar as CalendarIcon, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

interface Room {
  id: string;
  name: string;
  owner: string;
  members: string[];
  createdAt: string;
}

interface Event {
  id: string;
  roomId: string;
  title: string;
  date: string;
  time: string;
  createdBy: string;
}

interface CalendarViewProps {
  currentUser: string;
  onLogout: () => void;
}

export function CalendarView({ currentUser, onLogout }: CalendarViewProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [rooms, setRooms] = useState<Room[]>(() => {
    const stored = localStorage.getItem("rooms");
    return stored ? JSON.parse(stored) : [];
  });
  const [currentRoomId, setCurrentRoomId] = useState<string>(() => {
    const stored = localStorage.getItem(`currentRoom_${currentUser}`);
    return stored || "";
  });
  const [events, setEvents] = useState<Event[]>(() => {
    const stored = localStorage.getItem("events");
    return stored ? JSON.parse(stored) : [];
  });

  const [showRoomDialog, setShowRoomDialog] = useState(false);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);
  const [newRoomName, setNewRoomName] = useState("");
  const [inviteUsername, setInviteUsername] = useState("");
  const [newEvent, setNewEvent] = useState({ title: "", time: "09:00" });

  const saveRooms = (updatedRooms: Room[]) => {
    setRooms(updatedRooms);
    localStorage.setItem("rooms", JSON.stringify(updatedRooms));
  };

  const saveEvents = (updatedEvents: Event[]) => {
    setEvents(updatedEvents);
    localStorage.setItem("events", JSON.stringify(updatedEvents));
  };

  const handleCreateRoom = () => {
    if (!newRoomName.trim()) return;

    const newRoom: Room = {
      id: Date.now().toString(),
      name: newRoomName,
      owner: currentUser,
      members: [currentUser],
      createdAt: new Date().toISOString(),
    };

    const updatedRooms = [...rooms, newRoom];
    saveRooms(updatedRooms);
    setCurrentRoomId(newRoom.id);
    localStorage.setItem(`currentRoom_${currentUser}`, newRoom.id);
    setNewRoomName("");
    setShowRoomDialog(false);
  };

  const handleInvite = () => {
    if (!inviteUsername.trim() || !currentRoomId) return;

    const users = JSON.parse(localStorage.getItem("users") || "{}");
    if (!users[inviteUsername]) {
      alert("존재하지 않는 사용자입니다");
      return;
    }

    const updatedRooms = rooms.map(room => {
      if (room.id === currentRoomId) {
        if (room.members.includes(inviteUsername)) {
          alert("이미 초대된 사용자입니다");
          return room;
        }
        return { ...room, members: [...room.members, inviteUsername] };
      }
      return room;
    });

    saveRooms(updatedRooms);
    setInviteUsername("");
    setShowInviteDialog(false);
  };

  const handleAddEvent = () => {
    if (!newEvent.title.trim() || !selectedDate || !currentRoomId) return;

    const event: Event = {
      id: Date.now().toString(),
      roomId: currentRoomId,
      title: newEvent.title,
      date: format(selectedDate, "yyyy-MM-dd"),
      time: newEvent.time,
      createdBy: currentUser,
    };

    saveEvents([...events, event]);
    setNewEvent({ title: "", time: "09:00" });
    setShowEventDialog(false);
  };

  const handleDeleteClick = (eventId: string) => {
    setEventToDelete(eventId);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    if (eventToDelete) {
      saveEvents(events.filter(e => e.id !== eventToDelete));
      setEventToDelete(null);
    }
    setShowDeleteDialog(false);
  };

  const handleRoomChange = (roomId: string) => {
    setCurrentRoomId(roomId);
    localStorage.setItem(`currentRoom_${currentUser}`, roomId);
  };

  const currentRoom = rooms.find(r => r.id === currentRoomId);
  const myRooms = rooms.filter(r => r.members.includes(currentUser));

  const currentRoomEvents = currentRoomId
    ? events.filter(e => e.roomId === currentRoomId)
    : [];

  const selectedDateEvents = selectedDate
    ? currentRoomEvents.filter(e => e.date === format(selectedDate, "yyyy-MM-dd"))
    : [];

  const eventDates = currentRoomEvents.map(e => new Date(e.date));

  return (
    <div className="h-screen bg-background flex flex-col max-w-[393px] mx-auto">
      {/* Header */}
      <header className="border-b bg-card shrink-0">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
              <CalendarIcon className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-base font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">틈</h1>
              <p className="text-xs text-muted-foreground">{currentUser}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onLogout}>
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          {/* Room Selection and Actions */}
          <div className="space-y-2">
            {myRooms.length > 0 ? (
              <Select value={currentRoomId} onValueChange={handleRoomChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="방 선택" />
                </SelectTrigger>
                <SelectContent>
                  {myRooms.map(room => (
                    <SelectItem key={room.id} value={room.id}>
                      {room.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-2">방을 만들어 시작하세요</p>
            )}

            <div className="flex gap-2">
              <Button onClick={() => setShowRoomDialog(true)} variant="outline" className="flex-1" size="sm">
                <Plus className="w-4 h-4 mr-1" />
                방 만들기
              </Button>

              {currentRoom && (
                <Button onClick={() => setShowInviteDialog(true)} variant="outline" className="flex-1" size="sm">
                  <Users className="w-4 h-4 mr-1" />
                  초대하기
                </Button>
              )}
            </div>
          </div>

          {currentRoom && (
            <>
              {/* Calendar */}
              <Card>
                <CardContent className="pt-6 flex justify-center">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    locale={ko}
                    className="rounded-md"
                    modifiers={{
                      hasEvent: eventDates,
                    }}
                    modifiersClassNames={{
                      hasEvent: "bg-primary/10 font-bold",
                    }}
                  />
                </CardContent>
              </Card>

              {/* Events */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">
                      {selectedDate ? format(selectedDate, "M월 d일", { locale: ko }) : "날짜 선택"}
                    </CardTitle>
                    {selectedDate && (
                      <Button size="sm" onClick={() => setShowEventDialog(true)}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {selectedDateEvents.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-6">
                      일정이 없습니다
                    </p>
                  ) : (
                    selectedDateEvents.map(event => (
                      <div
                        key={event.id}
                        className="p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors flex items-start justify-between gap-2"
                      >
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{event.title}</h4>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {event.time} · {event.createdBy}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClick(event.id)}
                          className="text-destructive hover:text-destructive shrink-0 h-8 w-8 p-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))
                  )}

                  {currentRoom.members.length > 1 && (
                    <div className="mt-4 pt-4 border-t">
                      <h4 className="text-xs font-medium mb-2 text-muted-foreground">방 멤버</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {currentRoom.members.map(member => (
                          <Badge key={member} variant="secondary" className="text-xs">
                            {member}
                            {member === currentRoom.owner && " 👑"}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}

          {!currentRoom && myRooms.length === 0 && (
            <Card className="text-center py-12 mt-8">
              <CardContent>
                <Users className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                <h3 className="font-medium mb-2 text-sm">방이 없습니다</h3>
                <p className="text-xs text-muted-foreground mb-4">
                  새로운 방을 만들어 시작하세요
                </p>
                <Button onClick={() => setShowRoomDialog(true)} size="sm">
                  <Plus className="w-4 h-4 mr-1" />
                  첫 번째 방 만들기
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Create Room Dialog */}
      <Dialog open={showRoomDialog} onOpenChange={setShowRoomDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>방 만들기</DialogTitle>
            <DialogDescription>
              새로운 일정 관리 방을 만들어 팀원들과 공유하세요
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="roomName">방 이름</Label>
              <Input
                id="roomName"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                placeholder="예: 팀 프로젝트"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRoomDialog(false)}>
              취소
            </Button>
            <Button onClick={handleCreateRoom}>만들기</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Invite Dialog */}
      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>사용자 초대</DialogTitle>
            <DialogDescription>
              방에 초대할 사용자명을 입력하세요
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="inviteUser">사용자명</Label>
              <Input
                id="inviteUser"
                value={inviteUsername}
                onChange={(e) => setInviteUsername(e.target.value)}
                placeholder="초대할 사용자명"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInviteDialog(false)}>
              취소
            </Button>
            <Button onClick={handleInvite}>초대하기</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Event Dialog */}
      <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>일정 추가</DialogTitle>
            <DialogDescription>
              {selectedDate && format(selectedDate, "yyyy년 M월 d일", { locale: ko })} 일정을 추가하세요
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="eventTitle">일정 제목</Label>
              <Input
                id="eventTitle"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                placeholder="예: 팀 미팅"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="eventTime">시간</Label>
              <Input
                id="eventTime"
                type="time"
                value={newEvent.time}
                onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEventDialog(false)}>
              취소
            </Button>
            <Button onClick={handleAddEvent}>추가하기</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>일정을 삭제하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              이 작업은 되돌릴 수 없습니다. 일정이 영구적으로 삭제됩니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
