import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';

export default function CmsNoticias() {
  const [noticias, setNoticias] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    loadNoticias();
  }, []);

  const loadNoticias = async () => {
    try {
      const data = await api.getPosts(1, 'noticia');
      setNoticias(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createPost({ site_id: 1, type: 'noticia', title, content, status: 'published' });
      setTitle('');
      setContent('');
      loadNoticias();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-screen-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Gerenciar Notícias</h1>
      <form onSubmit={handleSave} className="mb-8 space-y-4">
        <input 
          className="w-full border p-2 rounded" 
          type="text" 
          placeholder="Título" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          required 
        />
        <textarea 
          className="w-full border p-2 rounded" 
          placeholder="Conteúdo" 
          value={content} 
          onChange={(e) => setContent(e.target.value)} 
          required 
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">Salvar Notícia</button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {noticias.map((noticia: any) => (
          <div key={noticia.id} className="border p-4 rounded shadow">
            <h2 className="font-bold text-lg">{noticia.title}</h2>
            <p className="text-sm text-gray-600 truncate">{noticia.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}