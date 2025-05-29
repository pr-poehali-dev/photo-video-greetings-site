import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Icon from "@/components/ui/icon";

interface GreetingMedia {
  id: string;
  type: "image" | "video";
  url: string;
  title: string;
  author: string;
  date: string;
  thumbnail?: string;
}

const Index = () => {
  const [media, setMedia] = useState<GreetingMedia[]>([]);

  const [newTitle, setNewTitle] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);

  const ADMIN_PASSWORD = "поехали2024"; // Можете изменить на свой пароль

  const handlePasswordSubmit = () => {
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setShowPasswordDialog(false);
      setPasswordInput("");
    } else {
      alert("Неверный пароль");
      setPasswordInput("");
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = () => {
    if (selectedFile && newTitle && newAuthor) {
      const newMedia: GreetingMedia = {
        id: Date.now().toString(),
        type: selectedFile.type.startsWith("image/") ? "image" : "video",
        url: URL.createObjectURL(selectedFile),
        title: newTitle,
        author: newAuthor,
        date: new Date().toISOString().split("T")[0],
      };

      setMedia([newMedia, ...media]);
      setNewTitle("");
      setNewAuthor("");
      setSelectedFile(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-purple-900">
                🎉 Поздравления
              </h1>
              <p className="text-gray-600 mt-1">
                Делитесь радостными моментами
              </p>
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Icon name="Plus" size={16} />
                  Добавить поздравление
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">
                      Новое поздравление
                    </h3>
                    <p className="text-sm text-gray-600">
                      Загрузите фото или видео
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Input
                      placeholder="Заголовок поздравления"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                    />
                    <Input
                      placeholder="Ваше имя"
                      value={newAuthor}
                      onChange={(e) => setNewAuthor(e.target.value)}
                    />
                    <Input
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleFileUpload}
                    />
                  </div>

                  <Button
                    onClick={handleSubmit}
                    disabled={!selectedFile || !newTitle || !newAuthor}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    Опубликовать
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      {/* Кнопка для администратора */}
      {!isAdmin ? (
        <div className="text-center mb-8">
          <Button
            onClick={() => setShowPasswordDialog(true)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            <Icon name="Plus" className="mr-2" size={16} />
            Добавить поздравление
          </Button>
        </div>
      ) : (
        <Card className="mb-8 bg-gradient-to-r from-purple-50 to-pink-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="Upload" size={20} />
              Добавить новое поздравление
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Название поздравления"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <Input
              placeholder="Автор"
              value={newAuthor}
              onChange={(e) => setNewAuthor(e.target.value)}
            />
            <Input
              type="file"
              accept="image/*,video/*"
              onChange={handleFileUpload}
            />
            <div className="flex gap-2">
              <Button onClick={addNewMedia} className="flex-1">
                <Icon name="Plus" className="mr-2" size={16} />
                Добавить
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsAdmin(false)}
                className="text-red-600 hover:text-red-700"
              >
                <Icon name="LogOut" className="mr-2" size={16} />
                Выйти
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Диалог ввода пароля */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className="sm:max-w-md">
          <div className="space-y-4">
            <div className="text-center">
              <Icon
                name="Lock"
                size={48}
                className="mx-auto mb-4 text-purple-600"
              />
              <h3 className="text-lg font-semibold">Вход для администратора</h3>
              <p className="text-sm text-gray-600">
                Введите пароль для добавления поздравлений
              </p>
            </div>
            <Input
              type="password"
              placeholder="Пароль"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handlePasswordSubmit()}
            />
            <div className="flex gap-2">
              <Button onClick={handlePasswordSubmit} className="flex-1">
                Войти
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowPasswordDialog(false);
                  setPasswordInput("");
                }}
              >
                Отмена
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Сетка медиа */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {media.length === 0 ? (
          <div className="text-center py-12">
            <Icon
              name="ImagePlus"
              size={48}
              className="mx-auto text-gray-400 mb-4"
            />
            <h3 className="text-lg font-semibold text-gray-600">
              Пока нет поздравлений
            </h3>
            <p className="text-gray-500">Добавьте первое поздравление!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {media.map((item) => (
              <Card
                key={item.id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative aspect-square">
                  <img
                    src={item.url}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  {item.type === "video" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                      <Icon name="Play" size={48} className="text-white" />
                    </div>
                  )}
                </div>

                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>От: {item.author}</span>
                    <span>
                      {new Date(item.date).toLocaleDateString("ru-RU")}
                    </span>
                  </div>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-3"
                      >
                        <Icon name="Eye" size={16} />
                        Посмотреть
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-xl font-semibold">
                            {item.title}
                          </h3>
                          <p className="text-gray-600">От: {item.author}</p>
                        </div>
                        <div className="relative max-h-[70vh]">
                          {item.type === "image" ? (
                            <img
                              src={item.url}
                              alt={item.title}
                              className="w-full h-full object-contain rounded-lg"
                            />
                          ) : (
                            <video
                              src={item.url}
                              controls
                              className="w-full h-full rounded-lg"
                            />
                          )}
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
