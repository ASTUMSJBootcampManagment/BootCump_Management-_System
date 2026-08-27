import {
  useEffect,
  useState,
} from "react";

import {
  Plus,
  UserCheck,
  Mail,
  RefreshCw,
} from "lucide-react";

import API from "../../api/axios";

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
    form,
    setForm,
  ] = useState({
    fullname: "",
    email: "",
  });

  const [
    selectedMentor,
    setSelectedMentor,
  ] = useState("");

  const [
    selectedBatch,
    setSelectedBatch,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    message,
    setMessage,
  ] = useState("");

  const load = async () => {
    try {
      const [
        mentorResponse,
        batchResponse,
      ] = await Promise.all([
        API.get("/admin/mentors"),
        API.get("/batches"),
      ]);

      setMentors(
        mentorResponse.data.data ||
          []
      );

      setBatches(
        batchResponse.data.data ||
          []
      );
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Unable to load mentors."
      );
    }
  };

  useEffect(() => {
    load();
  }, []);

  const createMentor = async (
    event
  ) => {
    event.preventDefault();

    setLoading(true);

    try {
      const response =
        await API.post(
          "/admin/mentors",
          form
        );

      setMessage(
        response.data.message
      );

      setForm({
        fullname: "",
        email: "",
      });

      load();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Unable to create mentor."
      );
    } finally {
      setLoading(false);
    }
  };

  const assign = async () => {
    if (
      !selectedMentor ||
      !selectedBatch
    ) {
      setMessage(
        "Select both a mentor and a batch."
      );
      return;
    }

    try {
      const response =
        await API.post(
          `/batches/${selectedBatch}/mentors`,
          {
            mentorId:
              selectedMentor,
          }
        );

      setMessage(
        response.data.message
      );

      load();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Unable to assign mentor."
      );
    }
  };

  return (
    <div className="
      space-y-6
    ">
      <div>
        <h2 className="
          text-2xl
          font-black
          text-[#062a5c]
        ">
          Mentor Management
        </h2>

        <p className="
          text-sm
          text-slate-500
          mt-1
        ">
          Mentors are created by the
          administrator and assigned to
          batches.
        </p>
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
        ">
          {message}
        </div>
      )}

      <div className="
        grid
        lg:grid-cols-2
        gap-5
      ">
        <section className="
          bg-white
          border
          border-slate-200
          rounded-2xl
          p-6
        ">
          <div className="
            flex
            items-center
            gap-3
            mb-5
          ">
            <div className="
              w-10
              h-10
              rounded-xl
              bg-emerald-50
              text-emerald-600
              grid
              place-items-center
            ">
              <Plus size={19} />
            </div>

            <div>
              <h3 className="
                font-black
                text-[#062a5c]
              ">
                Create mentor
              </h3>

              <p className="
                text-xs
                text-slate-400
              ">
                Login credentials are
                emailed automatically.
              </p>
            </div>
          </div>

          <form
            onSubmit={createMentor}
            className="
              space-y-4
            "
          >
            <input
              required
              placeholder="Mentor full name"
              className="
                w-full
                border
                border-slate-200
                rounded-xl
                px-4
                py-3
                outline-none
                focus:border-[#08c98b]
              "
              value={
                form.fullname
              }
              onChange={(event) =>
                setForm({
                  ...form,
                  fullname:
                    event.target.value,
                })
              }
            />

            <input
              required
              type="email"
              placeholder="Mentor email"
              className="
                w-full
                border
                border-slate-200
                rounded-xl
                px-4
                py-3
                outline-none
                focus:border-[#08c98b]
              "
              value={form.email}
              onChange={(event) =>
                setForm({
                  ...form,
                  email:
                    event.target.value,
                })
              }
            />

            <button
              disabled={loading}
              className="
                w-full
                bg-[#08c98b]
                text-white
                rounded-xl
                py-3
                font-black
              "
            >
              {loading
                ? "Creating..."
                : "Create Mentor"}
            </button>
          </form>
        </section>

        <section className="
          bg-white
          border
          border-slate-200
          rounded-2xl
          p-6
        ">
          <div className="
            flex
            items-center
            gap-3
            mb-5
          ">
            <div className="
              w-10
              h-10
              rounded-xl
              bg-blue-50
              text-blue-600
              grid
              place-items-center
            ">
              <UserCheck size={19} />
            </div>

            <div>
              <h3 className="
                font-black
                text-[#062a5c]
              ">
                Assign mentor to batch
              </h3>
            </div>
          </div>

          <div className="
            space-y-4
          ">
            <select
              className="
                w-full
                border
                border-slate-200
                rounded-xl
                px-4
                py-3
              "
              value={
                selectedMentor
              }
              onChange={(e) =>
                setSelectedMentor(
                  e.target.value
                )
              }
            >
              <option value="">
                Select mentor
              </option>

              {mentors.map(
                (mentor) => (
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

            <select
              className="
                w-full
                border
                border-slate-200
                rounded-xl
                px-4
                py-3
              "
              value={
                selectedBatch
              }
              onChange={(e) =>
                setSelectedBatch(
                  e.target.value
                )
              }
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
                    {batch.name}
                  </option>
                )
              )}
            </select>

            <button
              onClick={assign}
              className="
                w-full
                bg-[#062a5c]
                text-white
                rounded-xl
                py-3
                font-black
              "
            >
              Assign Mentor
            </button>
          </div>
        </section>
      </div>

      <section className="
        bg-white
        border
        border-slate-200
        rounded-2xl
        overflow-hidden
      ">
        <div className="
          px-6
          py-4
          border-b
          flex
          justify-between
        ">
          <h3 className="
            font-black
            text-[#062a5c]
          ">
            Registered mentors
          </h3>

          <button
            onClick={load}
            className="
              text-slate-400
            "
          >
            <RefreshCw
              size={17}
            />
          </button>
        </div>

        <div className="
          divide-y
        ">
          {mentors.map(
            (mentor) => (
              <div
                key={mentor._id}
                className="
                  px-6
                  py-4
                  flex
                  items-center
                  justify-between
                "
              >
                <div className="
                  flex
                  items-center
                  gap-3
                ">
                  <div className="
                    w-10
                    h-10
                    rounded-full
                    bg-[#e8faf5]
                    text-[#08ad81]
                    grid
                    place-items-center
                    font-black
                  ">
                    {(
                      mentor.fullname ||
                      "M"
                    )
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div>
                    <div className="
                      font-bold
                      text-[#062a5c]
                    ">
                      {
                        mentor.fullname
                      }
                    </div>

                    <div className="
                      text-xs
                      text-slate-400
                      flex
                      items-center
                      gap-1
                    ">
                      <Mail
                        size={12}
                      />
                      {
                        mentor.email
                      }
                    </div>
                  </div>
                </div>

                <span className="
                  px-3
                  py-1
                  rounded-full
                  bg-emerald-50
                  text-emerald-600
                  text-xs
                  font-bold
                ">
                  Mentor
                </span>
              </div>
            )
          )}

          {!mentors.length && (
            <div className="
              p-8
              text-center
              text-slate-400
            ">
              No mentors registered yet.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}