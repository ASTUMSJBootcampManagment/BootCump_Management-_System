import { useEffect, useMemo, useState } from "react";
import { CalendarCheck, RefreshCw, Search } from "lucide-react";
import MentorLayout from "../../components/mentor/MentorLayout";
import Toast from "../../components/common/Toast";
import API from "../../api/axios";

const STATUSES = ["present", "absent", "late", "excused"];
const statusClass = {
  present: "bg-emerald-50 text-emerald-700",
  absent: "bg-red-50 text-red-700",
  late: "bg-amber-50 text-amber-700",
  excused: "bg-sky-50 text-sky-700",
};

export default function Attendance() {
  const [students, setStudents] = useState([]);
  const [records, setRecords] = useState({});
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [group, setGroup] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const groups = useMemo(
    () =>
      [
        ...new Map(
          students.map((student) => [student.group?._id, student.group]),
        ).values(),
      ].filter(Boolean),
    [students],
  );
  const visibleStudents = useMemo(
    () =>
      students.filter(
        (student) =>
          (!group || student.group?._id === group) &&
          `${student.fullname} ${student.email}`
            .toLowerCase()
            .includes(search.toLowerCase()),
      ),
    [students, group, search],
  );
  const load = async () => {
    setLoading(true);
    try {
      const { data } = await API.get("/attendance/students");
      const loaded = data.data || [];
      setStudents(loaded);
      const selected = group || loaded[0]?.group?._id || "";
      if (!group && selected) setGroup(selected);
      if (selected) {
        const history = await API.get("/attendance/history", {
          params: { date, group: selected },
        });
        setRecords(
          Object.fromEntries(
            (history.data.data || []).map((item) => [
              item.student?._id || item.student,
              item.status,
            ]),
          ),
        );
      }
    } catch (error) {
      setToast({
        type: "error",
        message: error.response?.data?.message || "Unable to load attendance.",
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);
  useEffect(() => {
    if (!group) return;
    API.get("/attendance/history", { params: { date, group } })
      .then(({ data }) =>
        setRecords(
          Object.fromEntries(
            (data.data || []).map((item) => [
              item.student?._id || item.student,
              item.status,
            ]),
          ),
        ),
      )
      .catch(() => setRecords({}));
  }, [date, group]);
  const setStatus = (student, status) =>
    setRecords((current) => ({ ...current, [student]: status }));
  const markAll = (status) =>
    setRecords((current) => ({
      ...current,
      ...Object.fromEntries(
        visibleStudents.map((student) => [student._id, status]),
      ),
    }));
  const save = async () => {
    if (!group || !visibleStudents.length) return;
    setSaving(true);
    try {
      await API.post("/attendance/attender", {
        date,
        group,
        records: visibleStudents.map((student) => ({
          student: student._id,
          status: records[student._id] || "absent",
        })),
      });
      setToast({ type: "success", message: "Attendance saved successfully." });
    } catch (error) {
      setToast({
        type: "error",
        message: error.response?.data?.message || "Unable to save attendance.",
      });
    } finally {
      setSaving(false);
    }
  };
  return (
    <MentorLayout title="Attendance">
      <Toast {...toast} onClose={() => setToast(null)} />
      <div className="mb-6">
        <h2 className="text-3xl font-black text-[#062a5c]">Attendance</h2>
        <p className="text-slate-500 mt-2">
          Record, correct and review attendance for your assigned students.
        </p>
      </div>
      <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-5 grid lg:grid-cols-4 gap-4 items-end">
        <label className="text-sm font-bold">
          Date
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className="block w-full mt-2 border rounded-xl px-3 py-3"
          />
        </label>
        <label className="text-sm font-bold">
          Group
          <select
            value={group}
            onChange={(event) => setGroup(event.target.value)}
            className="block w-full mt-2 border rounded-xl px-3 py-3"
          >
            <option value="">Select a group</option>
            {groups.map((item) => (
              <option key={item._id} value={item._id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm font-bold">
          Search
          <div className="relative mt-2">
            <Search
              size={16}
              className="absolute left-3 top-3.5 text-slate-400"
            />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search students"
              className="w-full border rounded-xl pl-9 pr-3 py-3"
            />
          </div>
        </label>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => markAll("present")}
            className="px-3 py-3 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold"
          >
            All present
          </button>
          <button
            onClick={() => markAll("absent")}
            className="px-3 py-3 rounded-xl bg-red-50 text-red-700 text-xs font-bold"
          >
            All absent
          </button>
        </div>
      </div>
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-180 text-sm">
            <thead className="bg-[#062a5c] text-white">
              <tr>
                <th className="text-left px-5 py-4">Student</th>
                <th className="text-left px-5 py-4">Group</th>
                <th className="text-left px-5 py-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {visibleStudents.map((student) => (
                <tr key={student._id} className="border-t border-slate-100">
                  <td className="px-5 py-4">
                    <div className="font-black">{student.fullname}</div>
                    <div className="text-xs text-slate-400">
                      {student.email}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-slate-500">
                    {student.group?.name}
                  </td>
                  <td className="px-5 py-4">
                    <select
                      value={records[student._id] || "absent"}
                      onChange={(event) =>
                        setStatus(student._id, event.target.value)
                      }
                      className={`rounded-xl px-3 py-2 font-bold capitalize ${statusClass[records[student._id] || "absent"]}`}
                    >
                      {STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {loading && (
          <div className="p-10 text-center text-slate-400">
            Loading attendance...
          </div>
        )}
        {!loading && !visibleStudents.length && (
          <div className="p-10 text-center text-slate-400">
            No assigned students found. Ask an admin to add you and your
            students to a group in the active batch.
          </div>
        )}
      </div>
      <div className="mt-5 flex justify-end">
        <button
          onClick={save}
          disabled={loading || saving || !group || !visibleStudents.length}
          className="px-6 py-3.5 rounded-xl bg-[#08c98b] text-white font-black flex gap-2 disabled:opacity-50"
        >
          {saving ? (
            <RefreshCw size={17} className="animate-spin" />
          ) : (
            <CalendarCheck size={17} />
          )}
          {saving ? "Saving..." : "Save attendance"}
        </button>
      </div>
    </MentorLayout>
  );
}
