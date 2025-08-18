import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import NotePreviewModal from "./NotePreview.client";

// Определяем тип заметки
interface Note {
  id: string;
  title: string;
  content: string;
}

// Определяем интерфейс пропсов
interface PageProps {
  params: Promise<{ id: string }>;
}

// Функция получения данных заметки (замените на реальный API-запрос)
async function fetchNote(id: string): Promise<Note> {
  // Это заглушка, замените на реальный API-запрос
  return {
    id,
    title: `Заметка ${id}`,
    content: `Содержимое заметки ${id}`,
  };
}

// Фабрика ключей запроса
const queryKeys = {
  note: (id: string) => ["note", id] as const,
};

export default async function NotePage({ params }: PageProps) {
  const { id } = await params;

  // Инициализируем QueryClient
  const queryClient = new QueryClient();

  // Предварительно загружаем данные заметки
  await queryClient.prefetchQuery({
    queryKey: queryKeys.note(id),
    queryFn: () => fetchNote(id),
  });

  // Дегидратируем состояние для клиентской стороны
  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <NotePreviewModal noteId={id} />
    </HydrationBoundary>
  );
}
