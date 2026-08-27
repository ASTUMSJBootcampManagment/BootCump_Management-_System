import { useEffect, useState } from "react";
import { Eye, X } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import { getAssignments, getSubmissions, gradeSubmission } from "../../services/mentorService";

export default function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [selected, setSelected] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadAssignments = async () => {
    try { setLoading(true); setAssignments((await getAssignments()).data.data || []); }
    catch (error) { setMessage(error.response?.data?.message || "Unable to load assignments."); }
    finally { setLoading(false); }
  };
  useEffect(() => { loadAssignments(); }, []);

  const review = async (assignment) => {
    try { setSelected(assignment); setSubmissions((await getSubmissions(assignment._id)).data.data || []); }
    catch (error) { setMessage(error.response?.data?.message || "Unable to load submissions."); }
  };
  const grade = async (submission, event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    try {
      await gradeSubmission(submission._id, { grade: Number(formData.get("grade")), feedback: formData.get("feedback") });
      await review(selected); setMessage("Grade and feedback saved.");
    } catch (error) { setMessage(error.response?.data?.message || "Unable to save grade."); }
  };

  return <div className="flex min-h-screen bg-slate-50"><Sidebar /><main className="flex-1 p-5 sm:p-8">
    <div className="mx-auto max-w-6xl"><div className="mb-6"><h1 className="text-2xl font-bold text-slate-900">Assignments & grading</h1><p className="mt-1 text-sm text-slate-500">Review assignments and grade submissions from students in your batch.</p></div>
    {message && <p className="mb-4 rounded-xl bg-blue-50 p-3 text-sm text-blue-700">{message}</p>}
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">{loading ? <p className="p-8 text-center text-slate-500">Loading assignments…</p> : assignments.length === 0 ? <p className="p-10 text-center text-slate-500">No assignments yet.</p> : <table className="w-full min-w-150"><thead className="bg-slate-50 text-left text-xs uppercase text-slate-500"><tr><th className="p-4">Assignment</th><th className="p-4">Due date</th><th className="p-4">Review</th></tr></thead><tbody>{assignments.map((item) => <tr key={item._id} className="border-t border-slate-100"><td className="p-4"><p className="font-semibold text-slate-800">{item.title}</p><p className="mt-1 max-w-xl text-sm text-slate-500">{item.description}</p></td><td className="p-4 text-sm text-slate-600">{new Date(item.dueDate).toLocaleDateString()}</td><td className="p-4"><button onClick={() => review(item)} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"><Eye size={16}/>Submissions</button></td></tr>)}</tbody></table>}</section>
    {selected && <Modal title={`Submissions: ${selected.title}`} close={() => setSelected(null)}>{submissions.length === 0 ? <p className="text-sm text-slate-500">No submissions yet.</p> : <div className="space-y-4">{submissions.map((item) => <article key={item._id} className="rounded-xl border border-slate-200 p-4"><p className="font-semibold text-slate-800">{item.student?.name || "Student"}</p><p className="text-xs text-slate-500">{item.student?.email}</p><p className="my-3 whitespace-pre-wrap text-sm text-slate-700">{item.content}</p><form onSubmit={(event) => grade(item,event)} className="grid gap-2 sm:grid-cols-[120px_1fr_auto]"><input name="grade" required min="0" max="100" type="number" defaultValue={item.grade ?? ""} placeholder="Score /100" className="rounded-lg border border-slate-300 p-2 text-sm"/><input name="feedback" defaultValue={item.feedback} placeholder="Feedback for student" className="rounded-lg border border-slate-300 p-2 text-sm"/><button className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white">Save</button></form></article>)}</div>}</Modal>}
    </div></main></div>;
}
function Modal({title,close,children}) { return <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/40 p-4"><div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"><div className="mb-5 flex items-center justify-between"><h2 className="font-bold text-slate-900">{title}</h2><button onClick={close} className="rounded-lg p-2 hover:bg-slate-100"><X size={18}/></button></div>{children}</div></div>; }
