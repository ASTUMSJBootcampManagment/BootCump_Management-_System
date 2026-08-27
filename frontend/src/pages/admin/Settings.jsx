import {
  useEffect,
  useState,
} from "react";

import {
  AlertTriangle,
  Power,
  Lock,
  RefreshCw,
} from "lucide-react";

import API from "../../api/axios";

export default function Settings() {
  const [
    batches,
    setBatches,
  ] = useState([]);

  const [
    registrationOpen,
    setRegistrationOpen,
  ] = useState(false);

  const [
    activeBatch,
    setActiveBatch,
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
        settingsResponse,
        batchesResponse,
      ] = await Promise.all([
        API.get(
          "/auth/registration-status"
        ),
        API.get("/batches"),
      ]);

      setRegistrationOpen(
        Boolean(
          settingsResponse.data.open
        )
      );

      setActiveBatch(
        settingsResponse.data.batch ||
          null
      );

      setBatches(
        batchesResponse.data.data ||
          []
      );
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Unable to load system settings."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openRegistration = async () => {
    if (!activeBatch) {
      setMessage(
        "Select a batch first."
      );
      return;
    }

    try {
      const response =
        await API.post(
          "/system/registration/open",
          {
            batchId:
              activeBatch._id,
          }
        );

      setMessage(
        response.data.message
      );

      load();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Unable to open registration."
      );
    }
  };

  const closeRegistration =
    async () => {
      try {
        const response =
          await API.post(
            "/system/registration/close"
          );

        setMessage(
          response.data.message
        );

        load();
      } catch (error) {
        setMessage(
          error.response?.data?.message ||
            "Unable to close registration."
        );
      }
    };

  const completeBatch = async (
    batch
  ) => {
    const first =
      window.confirm(
        "WARNING: You are about to finish this bootcamp batch.\n\nStudents will no longer be considered active in this batch and registration will be disabled.\n\nAre you sure you want to continue?"
      );

    if (!first) return;

    const second =
      window.prompt(
        `This is a serious action.\n\nType COMPLETE to permanently mark "${batch.name}" as completed.`
      );

    if (
      second !==
      "COMPLETE"
    ) {
      return;
    }

    try {
      const response =
        await API.post(
          `/batches/${batch._id}/complete`,
          {
            confirm: true,
          }
        );

      setMessage(
        response.data.message
      );

      load();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Unable to complete batch."
      );
    }
  };

  if (loading) {
    return (
      <div className="
        p-8
        text-center
        text-slate-400
      ">
        Loading settings...
      </div>
    );
  }

  return (
    <div className="
      max-w-5xl
      space-y-6
    ">
      <div>
        <h2 className="
          text-2xl
          font-black
          text-[#062a5c]
        ">
          System Settings
        </h2>

        <p className="
          text-sm
          text-slate-500
          mt-1
        ">
          Control registration and batch
          lifecycle.
        </p>
      </div>

      {message && (
        <div className="
          bg-white
          border
          border-slate-200
          rounded-xl
          p-4
          font-semibold
          text-sm
        ">
          {message}
        </div>
      )}

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
          justify-between
          gap-5
          flex-wrap
        ">
          <div>
            <div className="
              flex
              items-center
              gap-2
            ">
              <Power
                size={20}
                className={
                  registrationOpen
                    ? "text-emerald-500"
                    : "text-slate-400"
                }
              />

              <h3 className="
                font-black
                text-[#062a5c]
              ">
                Student Registration
              </h3>
            </div>

            <p className="
              text-sm
              text-slate-500
              mt-2
            ">
              {registrationOpen
                ? "Registration is currently open."
                : "Registration is currently closed."}
            </p>

            {activeBatch && (
              <p className="
                text-xs
                text-slate-400
                mt-1
              ">
                Current batch:{" "}
                <strong>
                  {
                    activeBatch.name
                  }
                </strong>
              </p>
            )}
          </div>

          <span className={`
            px-4
            py-2
            rounded-full
            text-sm
            font-black
            ${
              registrationOpen
                ? "bg-emerald-50 text-emerald-600"
                : "bg-slate-100 text-slate-500"
            }
          `}>
            {registrationOpen
              ? "OPEN"
              : "CLOSED"}
          </span>
        </div>

        <div className="
          mt-6
          border-t
          pt-6
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
              activeBatch?._id ||
              ""
            }
            onChange={(e) => {
              const batch =
                batches.find(
                  (item) =>
                    item._id ===
                    e.target.value
                );

              setActiveBatch(
                batch || null
              );
            }}
          >
            <option value="">
              Select registration batch
            </option>

            {batches
              .filter(
                (batch) =>
                  batch.status !==
                  "Completed"
              )
              .map(
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

          <div className="
            flex
            gap-3
            flex-wrap
          ">
            <button
              onClick={
                openRegistration
              }
              className="
                px-5
                py-3
                rounded-xl
                bg-[#08c98b]
                text-white
                font-black
              "
            >
              Open Registration
            </button>

            <button
              onClick={
                closeRegistration
              }
              className="
                px-5
                py-3
                rounded-xl
                bg-slate-100
                text-slate-700
                font-black
              "
            >
              Close Registration
            </button>

            <button
              onClick={load}
              className="
                px-4
                py-3
                rounded-xl
                border
                border-slate-200
              "
            >
              <RefreshCw
                size={17}
              />
            </button>
          </div>
        </div>
      </section>

      <section className="
        bg-white
        border
        border-red-200
        rounded-2xl
        overflow-hidden
      ">
        <div className="
          bg-red-50
          p-6
          flex
          gap-4
        ">
          <div className="
            w-12
            h-12
            rounded-xl
            bg-red-100
            text-red-600
            grid
            place-items-center
            shrink-0
          ">
            <AlertTriangle
              size={23}
            />
          </div>

          <div>
            <h3 className="
              text-lg
              font-black
              text-red-800
            ">
              Finish a bootcamp batch
            </h3>

            <p className="
              text-sm
              text-red-700
              mt-1
              leading-6
            ">
              Only use this after the
              bootcamp has actually finished.
              This action disables registration
              for the batch and marks it as
              completed.
            </p>
          </div>
        </div>

        <div className="
          divide-y
        ">
          {batches.map(
            (batch) => (
              <div
                key={batch._id}
                className="
                  p-5
                  flex
                  items-center
                  justify-between
                  gap-4
                  flex-wrap
                "
              >
                <div>
                  <div className="
                    font-black
                    text-[#062a5c]
                  ">
                    {batch.name}
                  </div>

                  <div className="
                    text-xs
                    text-slate-400
                    mt-1
                  ">
                    {batch.students?.length ||
                      0}{" "}
                    students ·{" "}
                    {batch.mentors?.length ||
                      0}{" "}
                    mentors ·{" "}
                    {batch.status}
                  </div>
                </div>

                {batch.status !==
                  "Completed" && (
                  <button
                    onClick={() =>
                      completeBatch(
                        batch
                      )
                    }
                    className="
                      px-4
                      py-2.5
                      rounded-xl
                      bg-red-600
                      text-white
                      font-black
                      text-sm
                    "
                  >
                    Finish Batch
                  </button>
                )}
              </div>
            )
          )}
        </div>
      </section>
    </div>
  );
}