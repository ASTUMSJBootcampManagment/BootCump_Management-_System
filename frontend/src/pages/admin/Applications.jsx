import {
  useEffect,
  useState,
} from "react";

import {
  Check,
  X,
  Eye,
  RefreshCw,
  Search,
} from "lucide-react";

import API from "../../api/axios";
import Toast from "../../components/common/Toast";

function getArray(response) {
  const data = response?.data;

  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.users)) return data.users;

  return [];
}

function getError(error) {
  return (
    error?.response?.data?.message ||
    error?.message ||
    "Something went wrong."
  );
}

export default function Applications() {
  const [
    applications,
    setApplications,
  ] = useState([]);

  const [
    batches,
    setBatches,
  ] = useState([]);

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    status,
    setStatus,
  ] = useState("waiting");

  const [
    selected,
    setSelected,
  ] = useState(null);

  const [
    rejectReason,
    setRejectReason,
  ] = useState("");

  const [
    showReject,
    setShowReject,
  ] = useState(false);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    processing,
    setProcessing,
  ] = useState(false);

  const [
    toast,
    setToast,
  ] = useState(null);

  const load = async () => {
    setLoading(true);

    try {
      const [
        applicationsResponse,
        batchesResponse,
      ] = await Promise.all([
        API.get(
          "/admin/applications"
        ),
        API.get("/batches"),
      ]);

      setApplications(
        getArray(
          applicationsResponse
        )
      );

      setBatches(
        getArray(
          batchesResponse
        )
      );
    } catch (error) {
      setToast({
        message:
          getError(error),
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const approve = async () => {
    if (!selected) return;

    const batchId =
      selected.appliedBatch?._id ||
      selected.appliedBatch;

    if (!batchId) {
      setToast({
        message:
          "This application has no batch. Select a batch before approval.",
        type: "error",
      });

      return;
    }

    setProcessing(true);

    try {
      const response =
        await API.patch(
          `/admin/students/${selected._id}/approve`,
          {
            batchId,
          }
        );

      setToast({
        message:
          response.data?.message ||
          "Student approved successfully.",
        type: "success",
      });

      setSelected(null);

      await load();
    } catch (error) {
      setToast({
        message:
          getError(error),
        type: "error",
      });
    } finally {
      setProcessing(false);
    }
  };

  const reject = async () => {
    if (!selected) return;

    setProcessing(true);

    try {
      const response =
        await API.patch(
          `/admin/students/${selected._id}/reject`,
          {
            reason:
              rejectReason.trim(),
          }
        );

      setToast({
        message:
          response.data?.message ||
          "Application rejected.",
        type: "success",
      });

      setSelected(null);
      setShowReject(false);
      setRejectReason("");

      await load();
    } catch (error) {
      setToast({
        message:
          getError(error),
        type: "error",
      });
    } finally {
      setProcessing(false);
    }
  };

  const filtered =
    applications.filter(
      (application) => {
        const query =
          search
            .trim()
            .toLowerCase();

        const matchesSearch =
          !query ||
          application.fullname
            ?.toLowerCase()
            .includes(query) ||
          application.email
            ?.toLowerCase()
            .includes(query) ||
          application.universityId
            ?.toLowerCase()
            .includes(query);

        const matchesStatus =
          status === "all" ||
          application.applicationStatus ===
            status;

        return (
          matchesSearch &&
          matchesStatus
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
          <h2 className="text-2xl font-black text-[#062a5c]">
            Student Applications
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Review applications and accept or reject students.
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
            flex-col
            lg:flex-row
            gap-3
          "
        >
          <div className="relative flex-1">
            <Search
              size={17}
              className="
                absolute
                left-3
                top-3
                text-slate-400
              "
            />

            <input
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              placeholder="Search applicant..."
              className="
                w-full
                pl-10
                pr-4
                py-2.5
                rounded-xl
                border
                border-slate-200
                outline-none
                focus:border-[#08c98b]
                text-sm
              "
            />
          </div>

          <select
            value={status}
            onChange={(e) =>
              setStatus(
                e.target.value
              )
            }
            className="
              px-4
              py-2.5
              rounded-xl
              border
              border-slate-200
              bg-white
              text-sm
            "
          >
            <option value="waiting">
              Waiting
            </option>

            <option value="approved">
              Approved
            </option>

            <option value="rejected">
              Rejected
            </option>

            <option value="all">
              All
            </option>
          </select>

          <button
            type="button"
            onClick={load}
            className="
              px-4
              py-2.5
              rounded-xl
              border
              border-slate-200
              flex
              items-center
              justify-center
              gap-2
              text-sm
              font-bold
            "
          >
            <RefreshCw size={15} />
            Refresh
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
              Loading applications...
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-10 text-center text-slate-400">
              No applications found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th className="text-left px-5 py-4">
                      Applicant
                    </th>

                    <th className="text-left px-5 py-4">
                      University ID
                    </th>

                    <th className="text-left px-5 py-4">
                      Batch
                    </th>

                    <th className="text-left px-5 py-4">
                      Status
                    </th>

                    <th className="text-right px-5 py-4">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {filtered.map(
                    (application) => (
                      <tr
                        key={
                          application._id
                        }
                        className="hover:bg-slate-50"
                      >
                        <td className="px-5 py-4">
                          <p className="font-bold text-[#062a5c]">
                            {
                              application.fullname
                            }
                          </p>

                          <p className="text-xs text-slate-400">
                            {
                              application.email
                            }
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          {
                            application.universityId ||
                            "—"
                          }
                        </td>

                        <td className="px-5 py-4">
                          {
                            application
                              .appliedBatch
                              ?.name ||
                            "Not assigned"
                          }
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`
                              px-2.5
                              py-1
                              rounded-full
                              text-[10px]
                              font-black
                              ${
                                application.applicationStatus ===
                                "approved"
                                  ? "bg-emerald-50 text-emerald-700"
                                  : application.applicationStatus ===
                                    "rejected"
                                  ? "bg-red-50 text-red-600"
                                  : "bg-amber-50 text-amber-700"
                              }
                            `}
                          >
                            {
                              application.applicationStatus
                            }
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                setSelected(
                                  application
                                )
                              }
                              className="
                                p-2
                                rounded-lg
                                bg-slate-100
                                text-slate-600
                              "
                            >
                              <Eye size={16} />
                            </button>

                            {application.applicationStatus ===
                              "waiting" && (
                              <>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setSelected(
                                      application
                                    )
                                  }
                                  className="
                                    p-2
                                    rounded-lg
                                    bg-emerald-50
                                    text-emerald-600
                                  "
                                >
                                  <Check size={16} />
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelected(
                                      application
                                    );
                                    setShowReject(
                                      true
                                    );
                                  }}
                                  className="
                                    p-2
                                    rounded-lg
                                    bg-red-50
                                    text-red-600
                                  "
                                >
                                  <X size={16} />
                                </button>
                              </>
                            )}
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

      {selected && !showReject && (
        <div
          className="
            fixed
            inset-0
            z-[100]
            bg-slate-900/40
            backdrop-blur-sm
            grid
            place-items-center
            p-5
          "
        >
          <div
            className="
              bg-white
              rounded-2xl
              w-full
              max-w-2xl
              max-h-[90vh]
              overflow-y-auto
              p-6
            "
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black text-[#062a5c]">
                  Application Details
                </h3>

                <p className="text-xs text-slate-400 mt-1">
                  Review the submitted information.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelected(null)
                }
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mt-6">
              {[
                [
                  "Full name",
                  selected.fullname,
                ],
                [
                  "Email",
                  selected.email,
                ],
                [
                  "University ID",
                  selected.universityId,
                ],
                [
                  "Phone",
                  selected.phoneNumber,
                ],
                [
                  "Gender",
                  selected.gender,
                ],
                [
                  "Telegram",
                  selected.telegramUsername,
                ],
                [
                  "Codeforces",
                  selected.codeforcesAccount,
                ],
                [
                  "LeetCode",
                  selected.leetcodeAccount,
                ],
                [
                  "GitHub",
                  selected.githubAccount,
                ],
                [
                  "Laptop",
                  selected.hasPersonalLaptop
                    ? "Yes"
                    : "No",
                ],
                [
                  "Internet",
                  selected.hasConstantInternet
                    ? "Yes"
                    : "No",
                ],
              ].map(
                ([label, value]) => (
                  <div
                    key={label}
                    className="
                      p-4
                      rounded-xl
                      bg-slate-50
                    "
                  >
                    <p className="text-[10px] uppercase font-black text-slate-400">
                      {label}
                    </p>

                    <p className="text-sm font-bold text-slate-700 mt-1 break-words">
                      {value || "—"}
                    </p>
                  </div>
                )
              )}
            </div>

            <div className="mt-4 p-4 rounded-xl bg-slate-50">
              <p className="text-[10px] uppercase font-black text-slate-400">
                Reason to join
              </p>

              <p className="text-sm text-slate-600 mt-2 leading-6">
                {selected.reasonToJoin ||
                  "—"}
              </p>
            </div>

            {selected.applicationStatus ===
              "waiting" && (
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() =>
                    setShowReject(true)
                  }
                  className="
                    px-4
                    py-2.5
                    rounded-xl
                    bg-red-50
                    text-red-600
                    font-bold
                  "
                >
                  Reject
                </button>

                <button
                  type="button"
                  onClick={approve}
                  disabled={processing}
                  className="
                    px-4
                    py-2.5
                    rounded-xl
                    bg-[#08c98b]
                    text-white
                    font-bold
                    disabled:opacity-50
                  "
                >
                  {processing
                    ? "Processing..."
                    : "Approve"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {showReject && selected && (
        <div
          className="
            fixed
            inset-0
            z-[110]
            bg-slate-900/40
            grid
            place-items-center
            p-5
          "
        >
          <div
            className="
              bg-white
              rounded-2xl
              p-6
              w-full
              max-w-md
            "
          >
            <h3 className="text-lg font-black text-[#062a5c]">
              Reject Application
            </h3>

            <p className="text-sm text-slate-500 mt-2">
              You can provide a reason that will be sent to the applicant.
            </p>

            <textarea
              value={rejectReason}
              onChange={(e) =>
                setRejectReason(
                  e.target.value
                )
              }
              rows={5}
              placeholder="Rejection reason..."
              className="
                w-full
                mt-4
                border
                border-slate-200
                rounded-xl
                p-3
                text-sm
                outline-none
                focus:border-[#08c98b]
              "
            />

            <div className="flex justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={() => {
                  setShowReject(false);
                  setRejectReason("");
                }}
                className="
                  px-4
                  py-2.5
                  rounded-xl
                  bg-slate-100
                  font-bold
                "
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={reject}
                disabled={processing}
                className="
                  px-4
                  py-2.5
                  rounded-xl
                  bg-red-600
                  text-white
                  font-bold
                  disabled:opacity-50
                "
              >
                {processing
                  ? "Rejecting..."
                  : "Reject Application"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}