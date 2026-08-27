import {
  useEffect,
  useState,
} from "react";

import {
  Plus,
  Search,
  RefreshCw,
  Users,
  UserPlus,
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

export default function Mentors() {
  const [
    mentors,
    setMentors,
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
    showCreate,
    setShowCreate,
  ] = useState(false);

  const [
    form,
    setForm,
  ] = useState({
    fullname: "",
    email: "",
  });

  const [
    selectedBatch,
    setSelectedBatch,
  ] = useState({});

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    assigning,
    setAssigning,
  ] = useState(null);

  const [
    toast,
    setToast,
  ] = useState(null);

  const load = async () => {
    setLoading(true);

    try {
      const [
        mentorResponse,
        batchResponse,
      ] = await Promise.all([
        API.get(
          "/users/search?role=Mentor"
        ),
        API.get("/batches"),
      ]);

      setMentors(
        arrayData(
          mentorResponse
        )
      );

      setBatches(
        arrayData(
          batchResponse
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

  const createMentor =
    async (event) => {
      event.preventDefault();

      setSaving(true);

      try {
        const response =
          await API.post(
            "/admin/mentors",
            form
          );

        setToast({
          message:
            response.data?.message ||
            "Mentor created successfully.",
          type: "success",
        });

        setForm({
          fullname: "",
          email: "",
        });

        setShowCreate(false);

        await load();
      } catch (error) {
        setToast({
          message:
            errorMessage(error),
          type: "error",
        });
      } finally {
        setSaving(false);
      }
    };

  const assignBatch = async (
    mentorId
  ) => {
    const batchId =
      selectedBatch[
        mentorId
      ];

    if (!batchId) {
      setToast({
        message:
          "Select a batch first.",
        type: "error",
      });

      return;
    }

    setAssigning(mentorId);

    try {
      const response =
        await API.post(
          `/batches/${batchId}/mentors`,
          {
            mentorId,
          }
        );

      setToast({
        message:
          response.data?.message ||
          "Mentor assigned to batch.",
        type: "success",
      });

      await load();
    } catch (error) {
      setToast({
        message:
          errorMessage(error),
        type: "error",
      });
    } finally {
      setAssigning(null);
    }
  };

  const filtered =
    mentors.filter(
      (mentor) => {
        const query =
          search
            .trim()
            .toLowerCase();

        return (
          !query ||
          mentor.fullname
            ?.toLowerCase()
            .includes(query) ||
          mentor.email
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

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-[#062a5c]">
              Mentors
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Create mentors and assign them to bootcamp batches.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setShowCreate(true)
            }
            className="
              px-4
              py-2.5
              rounded-xl
              bg-[#08c98b]
              text-white
              font-black
              text-sm
              flex
              items-center
              justify-center
              gap-2
            "
          >
            <Plus size={17} />
            Create Mentor
          </button>
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
              placeholder="Search mentors..."
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
            grid
            grid-cols-1
            lg:grid-cols-2
            gap-4
          "
        >
          {loading ? (
            <div className="lg:col-span-2 p-10 text-center text-slate-400">
              Loading mentors...
            </div>
          ) : filtered.length === 0 ? (
            <div className="lg:col-span-2 p-10 text-center text-slate-400">
              No mentors found.
            </div>
          ) : (
            filtered.map(
              (mentor) => (
                <div
                  key={
                    mentor._id
                  }
                  className="
                    bg-white
                    border
                    border-slate-200
                    rounded-2xl
                    p-5
                  "
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="
                        w-11
                        h-11
                        rounded-full
                        bg-[#e8faf5]
                        text-[#08ad81]
                        grid
                        place-items-center
                        font-black
                      "
                    >
                      {(
                        mentor.fullname ||
                        "M"
                      )
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div>
                      <p className="font-black text-[#062a5c]">
                        {
                          mentor.fullname
                        }
                      </p>

                      <p className="text-xs text-slate-400">
                        {mentor.email}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5">
                    <p className="text-[10px] uppercase font-black text-slate-400 mb-2">
                      Assign to batch
                    </p>

                    <div className="flex gap-2">
                      <select
                        value={
                          selectedBatch[
                            mentor._id
                          ] ||
                          ""
                        }
                        onChange={(e) =>
                          setSelectedBatch(
                            (
                              current
                            ) => ({
                              ...current,
                              [mentor._id]:
                                e.target.value,
                            })
                          )
                        }
                        className="
                          flex-1
                          border
                          border-slate-200
                          rounded-xl
                          px-3
                          py-2.5
                          text-sm
                          bg-white
                        "
                      >
                        <option value="">
                          Select batch
                        </option>

                        {batches.map(
                          (batch) => (
                            <option
                              key={
                                batch._id
                              }
                              value={
                                batch._id
                              }
                            >
                              {
                                batch.name
                              }
                            </option>
                          )
                        )}
                      </select>

                      <button
                        type="button"
                        disabled={
                          assigning ===
                          mentor._id
                        }
                        onClick={() =>
                          assignBatch(
                            mentor._id
                          )
                        }
                        className="
                          px-4
                          rounded-xl
                          bg-[#062a5c]
                          text-white
                          disabled:opacity-50
                        "
                      >
                        <UserPlus
                          size={17}
                        />
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
                    <Users size={14} />

                    Assigned batches are managed from the Batches page.
                  </div>
                </div>
              )
            )
          )}
        </div>
      </div>

      {showCreate && (
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
          <form
            onSubmit={
              createMentor
            }
            className="
              bg-white
              rounded-2xl
              p-6
              w-full
              max-w-md
            "
          >
            <h3 className="text-xl font-black text-[#062a5c]">
              Create Mentor
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              A temporary password will be generated and emailed.
            </p>

            <div className="space-y-4 mt-5">
              <input
                required
                value={
                  form.fullname
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    fullname:
                      e.target.value,
                  })
                }
                placeholder="Full name"
                className="
                  w-full
                  border
                  border-slate-200
                  rounded-xl
                  px-4
                  py-3
                  text-sm
                "
              />

              <input
                required
                type="email"
                value={
                  form.email
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    email:
                      e.target.value,
                  })
                }
                placeholder="Email address"
                className="
                  w-full
                  border
                  border-slate-200
                  rounded-xl
                  px-4
                  py-3
                  text-sm
                "
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() =>
                  setShowCreate(
                    false
                  )
                }
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
                type="submit"
                disabled={saving}
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
                {saving
                  ? "Creating..."
                  : "Create Mentor"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}