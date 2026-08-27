import { useEffect, useState } from "react";
import { Megaphone, Pencil, Plus, Send, Trash2, X } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import { createAnnouncement, deleteAnnouncement, getAnnouncements, updateAnnouncement } from "../../services/mentorService";

const empty = { title: "", content: "" };

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const load = async () => { try { setAnnouncements((await getAnnouncements()).data.data || []); } catch (error) { setMessage(error.response?.data?.message || "Unable to load announcements."); } };
  useEffect(() => { load(); }, []);
  const submit = async (event) => {
    event.preventDefault();
    try {
      if (editing) await updateAnnouncement(editing._id, form); else await createAnnouncement(form);
      setOpen(false); setEditing(null); setForm(empty); setMessage(editing ? "Announcement updated." : "Announcement published to your batch."); load();
    } catch (error) { setMessage(error.response?.data?.message || "Unable to save announcement."); }
  };
  const remove = async (id) => { if (!window.confirm("Delete this announcement?")) return; try { await deleteAnnouncement(id); setMessage("Announcement deleted."); load(); } catch (error) { setMessage(error.response?.data?.message || "Unable to delete announcement."); } };
  const edit = (item) => { setEditing(item); setForm({ title: item.title, content: item.content }); setOpen(true); };

  return <div className="flex min-h-screen bg-slate-50"><Sidebar/><main className="flex-1 p-5 sm:p-8"><div className="mx-auto max-w-5xl"><div className="mb-6 flex flex-wrap items-center justify-between gap-4"><div><h1 className="text-2xl font-bold text-slate-900">Announcements</h1><p className="mt-1 text-sm text-slate-500">Send updates directly to students in your assigned batch.</p></div><button onClick={() => { setEditing(null); setForm(empty); setOpen(true); }} className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-600"><Plus size={17}/>New announcement</button></div>
  {message && <p className="mb-4 rounded-xl bg-blue-50 p-3 text-sm text-blue-700">{message}</p>}
  <section className="space-y-4">{announcements.length === 0 ? <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500"><Megaphone className="mx-auto mb-3 text-slate-400"/>No announcements yet.</div> : announcements.map((item) => <article key={item._id} className="rounded-2xl border border-slate-200 bg-white p-5"><div className="flex items-start justify-between gap-4"><div><span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">Your batch</span><h2 className="mt-3 text-lg font-bold text-slate-900">{item.title}</h2><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">{item.content}</p><p className="mt-3 text-xs text-slate-400">{new Date(item.announcementDate || item.createdAt).toLocaleString()}</p></div><div className="flex shrink-0 gap-1"><button onClick={() => edit(item)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><Pencil size={17}/></button><button onClick={() => remove(item._id)} className="rounded-lg p-2 text-rose-500 hover:bg-rose-50"><Trash2 size={17}/></button></div></div></article>)}</section>
  {open && <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/40 p-4"><form onSubmit={submit} className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl"><div className="mb-5 flex items-center justify-between"><h2 className="font-bold text-slate-900">{editing ? "Edit announcement" : "New announcement"}</h2><button type="button" onClick={() => setOpen(false)} className="rounded-lg p-2 hover:bg-slate-100"><X size={18}/></button></div><label className="block text-sm font-medium text-slate-700">Title<input required value={form.title} onChange={(e) => setForm({...form,title:e.target.value})} className="mt-1 w-full rounded-xl border border-slate-300 p-3"/></label><label className="mt-4 block text-sm font-medium text-slate-700">Message<textarea required rows="5" value={form.content} onChange={(e) => setForm({...form,content:e.target.value})} className="mt-1 w-full rounded-xl border border-slate-300 p-3"/></label><button className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white"><Send size={16}/>{editing ? "Save changes" : "Publish"}</button></form></div>}
  </div></main></div>;
}
