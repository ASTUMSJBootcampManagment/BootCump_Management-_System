import {
  useEffect,
  useState,
} from "react";

import {
  Search,
  RefreshCw,
  UserCheck,
} from "lucide-react";

import API from "../../api/axios";
import Toast from "../../components/common/Toast";

function arrayData(response) {
  const data = response?.data;

  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.users)) return data.users;

  return [];
}

function errorMessage(error) {
  return (
    error?.response?.data?.message ||
    error?.message ||
    "Request failed."
  );
}

export default function Students() {
  const [
    students,
    setStudents,
  ] = useState([]);

  const [
    mentors,
    setMentors,
  ] = useState([]);

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    mentorSelections,
    setMentorSelections,
  ] = useState({});

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    saving,
    setSaving,
  ] = useState(null);

  const [
    toast,
    setToast,
  ] = useState(null);

  const load = async () => {
    setLoading(true);

    try {
      const [
        studentResponse,
        mentorResponse,
      ] = await Promise.all([
        API.get(
          "/users/search?role=Student"
        ),
        API.get(
          "/users/search?role=Mentor"
        ),
      ]);

      setStudents(
        arrayData(
          studentResponse
        )
      );

      setMentors(
        arrayData(
          mentorResponse
        )
      );
    } catch (error) {
      setToast({
        message:
          errorMessage(error),
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const assignMentor = async (
    studentId
  ) => {
    const mentorId =
      mentorSelections[
        studentId
      ];

    if (!mentorId) {
      setToast({
        message:
          "Select a mentor first.",
        type: "error",
      });

      return;
    }

    setSaving(studentId);

    try {
      const response =
        await API.patch(
          `/admin/students/${studentId}/mentor`,
          {
            studentId,
            mentorId,
          }
        );

      const mentor =
        mentors.find(
          (item) =>
            item._id ===
            mentorId
        );

      setStudents(
        (current) =>
          current.map(
            (student) =>
              student._id ===
              studentId
                ? {
                    ...student,
                    assignedMentor:
                      mentor,
                  }
                : student
          )
      );

      setToast({
        message:
          response.data?.message ||
          "Mentor assigned successfully.",
        type: "success",
      });
    } catch (error) {
      setToast({
        message:
          errorMessage(error),
        type: "error",
      });
    } finally {
      setSaving(null);
    }
  };

  const filtered =
    students.filter(
      (student) => {
        const query =
          search
            .trim()
            .toLowerCase();

        return (
          !query ||
          student.fullname
            ?.toLowerCase()
            .includes(query) ||
          student.email
            ?.toLowerCase()
            .includes(query) ||
          student.universityId
            ?.toLowerCase()
            .includes(query)
        );
      }
    );

  return (
    <>
      <Toast
        message={toast?.message}
        type={toast?.type}
        onClose={() =>
          setToast(null)
        }
      />

      <div className="space-y-6">

        <div>
          
          <p className="text-sm text-slate-500 mt-1">
            View approved students and assign their mentors.
          </p>
        </div>

        <div
          className="
            bg-white
            border
            border-slate-200
            rounded-2xl
            p-4
            flex
            gap-3
          "
        >
          <div className="relative flex-1">
            <Search
              size={17}
              className="absolute left-3 top-3 text-slate-400"
            />

            <input
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              placeholder="Search students..."
              className="
                w-full
                pl-10
                pr-4
                py-2.5
                border
                border-slate-200
                rounded-xl
                text-sm
                outline-none
                focus:border-[#08c98b]
              "
            />
          </div>

          <button
            type="button"
            onClick={load}
            className="
              px-4
              rounded-xl
              border
              border-slate-200
            "
          >
            <RefreshCw size={16} />
          </button>
        </div>

        <div
          className="
            bg-white
            border
            border-slate-200
            rounded-2xl
            overflow-hidden
          "
        >
          {loading ? (
            <div className="p-10 text-center text-slate-400">
              Loading students...
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-10 text-center text-slate-400">
              No students found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th className="text-left p-4">
                      Student
                    </th>

                    <th className="text-left p-4">
                      Batch
                    </th>

                    <th className="text-left p-4">
                      Current Mentor
                    </th>

                    <th className="text-left p-4">
                      Assign Mentor
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {filtered.map(
                    (student) => (
                      <tr
                        key={
                          student._id
                        }
                        className="hover:bg-slate-50"
                      >
                        <td className="p-4">
                          <p className="font-bold text-[#062a5c]">
                            {
                              student.fullname
                            }
                          </p>

                          <p className="text-xs text-slate-400">
                            {
                              student.email
                            }
                          </p>

                          <p className="text-[10px] text-slate-400">
                            {
                              student.universityId ||
                              "No university ID"
                            }
                          </p>
                        </td>

                        <td className="p-4">
                          <span className="text-xs font-bold text-slate-600">
                            {student.assignedBatch?.name ||
                              student.appliedBatch?.name ||
                              "Unassigned"}
                          </span>
                        </td>

                        <td className="p-4">
                          <span className="text-xs text-slate-600">
                            {student.assignedMentor?.fullname ||
                              "Not assigned"}
                          </span>
                        </td>

                        <td className="p-4">
                          <div className="flex gap-2">
                            <select
                              value={
                                mentorSelections[
                                  student._id
                                ] ||
                                student
                                  .assignedMentor
                                  ?._id ||
                                ""
                              }
                              onChange={(e) =>
                                setMentorSelections(
                                  (
                                    current
                                  ) => ({
                                    ...current,
                                    [student._id]:
                                      e.target.value,
                                  })
                                )
                              }
                              className="
                                min-w-[170px]
                                border
                                border-slate-200
                                rounded-xl
                                px-3
                                py-2
                                text-xs
                                bg-white
                              "
                            >
                              <option value="">
                                Select mentor
                              </option>

                              {mentors.map(
                                (
                                  mentor
                                ) => (
                                  <option
                                    key={
                                      mentor._id
                                    }
                                    value={
                                      mentor._id
                                    }
                                  >
                                    {
                                      mentor.fullname
                                    }
                                  </option>
                                )
                              )}
                            </select>

                            <button
                              type="button"
                              disabled={
                                saving ===
                                student._id
                              }
                              onClick={() =>
                                assignMentor(
                                  student._id
                                )
                              }
                              className="
                                px-3
                                py-2
                                rounded-xl
                                bg-[#08c98b]
                                text-white
                                disabled:opacity-50
                              "
                            >
                              <UserCheck
                                size={16}
                              />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}