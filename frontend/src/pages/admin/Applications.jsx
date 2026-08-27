import {
  useEffect,
  useState,
} from "react";

import {
  Check,
  X,
  Eye,
  RefreshCw,
} from "lucide-react";

import API from "../../api/axios";

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
    selected,
    setSelected,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    message,
    setMessage,
  ] = useState("");

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
        applicationsResponse.data.data ||
          []
      );

      setBatches(
        batchesResponse.data.data ||
          []
      );
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Unable to load applications."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const approve = async (
    application
  ) => {
    const batchId =
      application.appliedBatch?._id ||
      application.appliedBatch;

    if (!batchId) {
      setMessage(
        "This application does not have a batch. Select a batch first."
      );
      return;
    }

    if (
      !window.confirm(
        `Accept ${application.fullname} into this batch?`
      )
    ) {
      return;
    }

    try {
      const response =
        await API.patch(
          `/admin/students/${application._id}/approve`,
          {
            batchId,
          }
        );

      setMessage(
        response.data.message
      );

      setSelected(null);

      load();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Unable to approve student."
      );
    }
  };

  const reject = async (
    application
  ) => {
    const reason =
      window.prompt(
        "Enter rejection reason:"
      );

    if (reason === null) return;

    try {
      const response =
        await API.patch(
          `/admin/students/${application._id}/reject`,
          {
            reason,
          }
        );

      setMessage(
        response.data.message
      );

      setSelected(null);

      load();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Unable to reject application."
      );
    }
  };

  const waiting =
    applications.filter(
      (item) =>
        item.applicationStatus ===
        "waiting"
    );

  return (
    <div className="
      space-y-6
    ">
      <div className="
        flex
        flex-wrap
        gap-3
        items-center
        justify-between
      ">
        <div>
          <h2 className="
            text-2xl
            font-black
            text-[#062a5c]
          ">
            Student Applications
          </h2>

          <p className="
            text-sm
            text-slate-500
            mt-1
          ">
            Review submitted registration
            forms before accepting students.
          </p>
        </div>

        <button
          onClick={load}
          className="
            px-4
            py-2.5
            rounded-xl
            bg-white
            border
            border-slate-200
            font-bold
            text-sm
            flex
            items-center
            gap-2
          "
        >
          <RefreshCw size={15} />
          Refresh
        </button>
      </div>

      {message && (
        <div className="
          bg-white
          border
          border-slate-200
          rounded-xl
          px-4
          py-3
          text-sm
          font-semibold
          text-slate-600
        ">
          {message}
        </div>
      )}

      <div className="
        bg-white
        rounded-2xl
        border
        border-slate-200
        overflow-hidden
      ">
        {loading ? (
          <div className="
            p-10
            text-center
            text-slate-400
          ">
            Loading applications...
          </div>
        ) : waiting.length === 0 ? (
          <div className="
            p-10
            text-center
            text-slate-400
          ">
            There are no students waiting
            for review.
          </div>
        ) : (
          <div className="
            overflow-x-auto
          ">
            <table className="
              w-full
              text-sm
            ">
              <thead className="
                bg-slate-50
                border-b
              ">
                <tr>
                  <th className="
                    text-left
                    px-5
                    py-4
                  ">
                    Student
                  </th>

                  <th className="
                    text-left
                    px-5
                    py-4
                  ">
                    University ID
                  </th>

                  <th className="
                    text-left
                    px-5
                    py-4
                  ">
                    Batch
                  </th>

                  <th className="
                    text-left
                    px-5
                    py-4
                  ">
                    Applied
                  </th>

                  <th className="
                    text-right
                    px-5
                    py-4
                  ">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {waiting.map(
                  (application) => (
                    <tr
                      key={
                        application._id
                      }
                      className="
                        border-b
                        last:border-b-0
                      "
                    >
                      <td className="
                        px-5
                        py-4
                      ">
                        <div className="
                          font-bold
                          text-[#062a5c]
                        ">
                          {
                            application.fullname
                          }
                        </div>

                        <div className="
                          text-xs
                          text-slate-400
                        ">
                          {
                            application.email
                          }
                        </div>
                      </td>

                      <td className="
                        px-5
                        py-4
                      ">
                        {
                          application.universityId
                        }
                      </td>

                      <td className="
                        px-5
                        py-4
                      ">
                        {application.appliedBatch?.name ||
                          "Not assigned"}
                      </td>

                      <td className="
                        px-5
                        py-4
                        text-slate-500
                      ">
                        {application.createdAt
                          ? new Date(
                              application.createdAt
                            ).toLocaleDateString()
                          : "—"}
                      </td>

                      <td className="
                        px-5
                        py-4
                      ">
                        <div className="
                          flex
                          justify-end
                          gap-2
                        ">
                          <button
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
                            title="Review"
                          >
                            <Eye size={16} />
                          </button>

                          <button
                            onClick={() =>
                              approve(
                                application
                              )
                            }
                            className="
                              p-2
                              rounded-lg
                              bg-emerald-50
                              text-emerald-600
                            "
                            title="Accept"
                          >
                            <Check size={16} />
                          </button>

                          <button
                            onClick={() =>
                              reject(
                                application
                              )
                            }
                            className="
                              p-2
                              rounded-lg
                              bg-red-50
                              text-red-600
                            "
                            title="Reject"
                          >
                            <X size={16} />
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

      {selected && (
        <div className="
          fixed
          inset-0
          z-50
          bg-black/50
          flex
          items-center
          justify-center
          p-4
        ">
          <div className="
            bg-white
            rounded-3xl
            w-full
            max-w-3xl
            max-h-[90vh]
            overflow-y-auto
            shadow-2xl
          ">
            <div className="
              px-6
              py-5
              border-b
              flex
              items-center
              justify-between
            ">
              <div>
                <h3 className="
                  text-xl
                  font-black
                  text-[#062a5c]
                ">
                  Application Review
                </h3>

                <p className="
                  text-xs
                  text-slate-400
                ">
                  Review the complete
                  registration information.
                </p>
              </div>

              <button
                onClick={() =>
                  setSelected(null)
                }
                className="
                  p-2
                  rounded-lg
                  bg-slate-100
                "
              >
                <X size={18} />
              </button>
            </div>

            <div className="
              p-6
              grid
              md:grid-cols-2
              gap-4
            ">
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
                  "GitHub",
                  selected.githubAccount,
                ],
                [
                  "LeetCode",
                  selected.leetcodeAccount,
                ],
                [
                  "Codeforces",
                  selected.codeforcesAccount,
                ],
                [
                  "Internet",
                  selected.hasConstantInternet
                    ? "Yes"
                    : "No",
                ],
                [
                  "Personal laptop",
                  selected.hasPersonalLaptop
                    ? "Yes"
                    : "No",
                ],
              ].map(
                ([label, value]) => (
                  <div
                    key={label}
                    className="
                      bg-slate-50
                      rounded-xl
                      p-4
                    "
                  >
                    <div className="
                      text-[10px]
                      uppercase
                      tracking-wider
                      font-black
                      text-slate-400
                    ">
                      {label}
                    </div>

                    <div className="
                      mt-1
                      font-semibold
                      text-slate-700
                      break-words
                    ">
                      {value || "—"}
                    </div>
                  </div>
                )
              )}

              <div className="
                md:col-span-2
                bg-slate-50
                rounded-xl
                p-4
              ">
                <div className="
                  text-[10px]
                  uppercase
                  tracking-wider
                  font-black
                  text-slate-400
                ">
                  Reason for joining
                </div>

                <p className="
                  mt-2
                  text-sm
                  leading-6
                  text-slate-600
                  whitespace-pre-wrap
                ">
                  {
                    selected.reasonToJoin ||
                    "—"
                  }
                </p>
              </div>
            </div>

            <div className="
              p-6
              border-t
              flex
              justify-end
              gap-3
            ">
              <button
                onClick={() =>
                  reject(selected)
                }
                className="
                  px-5
                  py-3
                  rounded-xl
                  bg-red-50
                  text-red-600
                  font-bold
                "
              >
                Reject
              </button>

              <button
                onClick={() =>
                  approve(selected)
                }
                className="
                  px-5
                  py-3
                  rounded-xl
                  bg-[#08c98b]
                  text-white
                  font-bold
                "
              >
                Accept Student
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}