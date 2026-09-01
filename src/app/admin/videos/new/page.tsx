import { VideoForm } from "@/components/admin/video-form";

export default function NewVideoPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100">
        New Video
      </h1>
      <VideoForm />
    </div>
  );
}
