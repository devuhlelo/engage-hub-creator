import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';

export default function CmsVideos() {
  const [videos, setVideos] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      const data = await api.getPosts(1, 'video');
      setVideos(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createPost({ site_id: 1, type: 'video', title, content, status: 'published' });
      setTitle('');
      setContent('');
      loadVideos();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-screen-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Gerenciar Vídeos</h1>
      <form onSubmit={handleSave} className="mb-8 space-y-4">
        <input className="w-full border p-2 rounded" type="text" placeholder="Título do Vídeo" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <input className="w-full border p-2 rounded" type="text" placeholder="URL do YouTube/Vimeo" value={content} onChange={(e) => setContent(e.target.value)} required />
        <button className="bg-red-600 text-white px-4 py-2 rounded" type="submit">Salvar Vídeo</button>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {videos.map((video: any) => (
          <div key={video.id} className="border p-4 rounded shadow">
            <h2 className="font-bold text-lg">{video.title}</h2>
            <p className="text-sm text-blue-600 truncate">{video.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}