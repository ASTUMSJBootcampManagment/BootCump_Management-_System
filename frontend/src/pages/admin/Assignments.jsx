import { useEffect, useState } from "react";
import { Plus, Send } from "lucide-react";
import API from "../../api/axios";

const emptyForm = { title: "", description: "", dueDate: "", batch: "" };

export default function AdminAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [batches, setBatches] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");
  const load = async () => {
    try {
      const [assignmentResponse, batchResponse] = await Promise.all([API.get("/assignments"), API.get("/batches")]);
      setAssignments(assignmentResponse.data.data || []);
      setBatches(batchResponse.data.data || []);
    } catch (error) { setMessage(error.response?.data?.message || "Unable to load assignments."); }
  };
  useEffect(() => { load(); }, []);
  const submit = async (event) => {
    event.preventDefault();
    try { await API.post("/assignments", form); setForm(emptyForm); setMessage("Assignment created."); load(); }
    catch (error) { setMessage(error.response?.data?.message || "Unable to create assignment."); }
  };
  return <div className="space-y-6 p-6"><div><h1 className="text-2xl font-bold text-slate-800">Assignments</h1><p className="mt-1 text-sm text-slate-500">Create assignments and assign them to a bootcamp batch.</p></div>
    {message && <p className="rounded-xl bg-blue-50 p-3 text-sm text-blue-700">{message}</p>}
    <form onSubmit={submit} className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 md:grid-cols-2"><label className="text-sm font-medium text-slate-700">Title<input required value={form.title} onChange={(e) => setForm({...form,title:e.target.value})} className="mt-1 w-full rounded-xl border border-slate-300 p-3"/></label><label className="text-sm font-medium text-slate-700">Batch<select required value={form.batch} onChange={(e) => setForm({...form,batch:e.target.value})} className="mt-1 w-full rounded-xl border border-slate-300 p-3"><option value="">Select a batch</option>{batches.map((batch) => <option key={batch._id} value={batch._id}>{batch.name}</option>)}</select></label><label className="text-sm font-medium text-slate-700">Deadline<input required type="datetime-local" value={form.dueDate} onChange={(e) => setForm({...form,dueDate:e.target.value})} className="mt-1 w-full rounded-xl border border-slate-300 p-3"/></label><label className="text-sm font-medium text-slate-700">Description<textarea required rows="3" value={form.description} onChange={(e) => setForm({...form,description:e.target.value})} className="mt-1 w-full rounded-xl border border-slate-300 p-3"/></label><button className="inline-flex w-fit items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white"><Send size={16}/>Create assignment</button></form>
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white"><table className="w-full"><thead className="bg-slate-50 text-left text-xs uppercase text-slate-500"><tr><th className="p-4">Title</th><th className="p-4">Batch</th><th className="p-4">Deadline</th></tr></thead><tbody>{assignments.map((item) => <tr key={item._id} className="border-t border-slate-100"><td className="p-4 font-semibold text-slate-800">{item.title}</td><td className="p-4 text-sm text-slate-600">{item.batch?.name || "-"}</td><td className="p-4 text-sm text-slate-600">{new Date(item.dueDate).toLocaleDateString()}</td></tr>)}</tbody></table></section></div>;
}
