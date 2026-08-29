import React, { useEffect, useState } from "react";
import {
  AlertTriangle,
  Power,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";
import API from "../../api/axios";

export default function Settings() {
  const [batches, setBatches] = useState([]);
  const [registrationOpen, setRegistrationOpen] =
    useState(false);
  const [activeBatch, setActiveBatch] = useState(null);

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const load = async () => {
    setLoading(true);

    try {
      const [
        settingsResponse,
        batchesResponse,
      ] = await Promise.all([
        API.get("/auth/registration-status"),
        API.get("/batches"),
      ]);

      setRegistrationOpen(
        Boolean(settingsResponse.data?.open)
      );

      setActiveBatch(
        settingsResponse.data?.batch || null
      );

      setBatches(
        batchesResponse.data?.data || []
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
        "Select a batch before opening registration."
      );
      return;
    }

    try {
      const response = await API.post(
        "/system/registration/open",
        {
          batchId: activeBatch._id,
        }
      );

      setMessage(response.data.message);

      await load();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Unable to open registration."
      );
    }
  };

  const closeRegistration = async () => {
    try {
      const response = await API.post(
        "/system/registration/close"
      );

      setMessage(response.data.message);

      await load();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Unable to close registration."
      );
    }
  };

  const completeBatch = async (batch) => {
    const firstConfirm = window.confirm(
      `You are about to finish "${batch.name}".\n\nThis should only be done when the bootcamp has actually finished.\n\nContinue?`
    );

    if (!firstConfirm) return;

    const confirmation = window.prompt(
      `Type COMPLETE to finish "${batch.name}".`
    );

    if (confirmation !== "COMPLETE") {
      return;
    }

    try {
      const response = await API.post(
        `/batches/${batch._id}/complete`,
        {
          confirm: true,
        }
      );

      setMessage(response.data.message);

      await load();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Unable to complete batch."
      );
    }
  };

  if (loading) {
    return (
      <div className="py-16 text-center text-slate-400">
        Loading settings...
      </div>
    );
  }

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          

          <p className="text-sm text-slate-500 mt-1">
            Control registration and batch lifecycle.
          </p>
        </div>

        <button
          onClick={load}
          className="p-3 rounded-xl border border-slate-200 bg-white"
        >
          <RefreshCw size={18} />
        </button>
      </div>

      {message && (
        <div className="bg-white border border-slate-200 rounded-xl p-4 text-sm font-semibold text-slate-700">
          {message}
        </div>
      )}

      {/* Registration */}
      <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
       

        <div className="text-xs text-slate-400 font-bold uppercase">
            <p>.       registration controller</p>
          </div>
        <div className="p-6 space-y-5">
          <div
            className={`rounded-xl p-4 flex items-center gap-3 ${
              registrationOpen
                ? "bg-emerald-50 text-emerald-700"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            <CheckCircle2 size={20} />

            <div>
              <p className="font-black text-sm">
                Registration is{" "}
                {registrationOpen
                  ? "OPEN"
                  : "CLOSED"}
              </p>

              {activeBatch && (
                <p className="text-xs mt-1">
                  Current batch:{" "}
                  <strong>
                    {activeBatch.name}
                  </strong>
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="text-xs font-black text-slate-600">
              Registration Batch
            </label>

            <select
              value={activeBatch?._id || ""}
              onChange={(e) => {
                const batch = batches.find(
                  (item) =>
                    item._id === e.target.value
                );

                setActiveBatch(batch || null);
              }}
              className="w-full mt-1 px-3 py-3 border border-slate-200 rounded-xl text-sm bg-white"
            >
              <option value="">
                Select a batch
              </option>

              {batches
                .filter(
                  (batch) =>
                    batch.status !== "Completed"
                )
                .map((batch) => (
                  <option
                    key={batch._id}
                    value={batch._id}
                  >
                    {batch.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={openRegistration}
              className="px-5 py-3 rounded-xl bg-[#08c98b] text-white font-black text-sm"
            >
              Open Registration
            </button>

            <button
              onClick={closeRegistration}
              className="px-5 py-3 rounded-xl bg-slate-100 text-slate-700 font-black text-sm"
            >
              Close Registration
            </button>
          </div>
        </div>
      </section>

      {/* Batch completion */}
      <section className="bg-white border border-rose-200 rounded-2xl overflow-hidden">
        <div className="p-6 bg-rose-50">
          <div className="flex gap-4">
            <div className="w-11 h-11 rounded-xl bg-rose-100 text-rose-600 grid place-items-center shrink-0">
              <AlertTriangle size={22} />
            </div>

            <div>
              <h2 className="font-black text-rose-800">
                Finish a Bootcamp Batch
              </h2>

              <p className="text-sm text-rose-700 mt-1 leading-6">
                Only use this after the bootcamp has actually
                finished. Completed batches should not be used
                for new registration.
              </p>
            </div>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {batches.map((batch) => (
            <div
              key={batch._id}
              className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            >
              <div>
                <h3 className="font-black text-[#062a5c]">
                  {batch.name}
                </h3>

                <p className="text-xs text-slate-400 mt-1">
                  {batch.students?.length || 0} students ·{" "}
                  {batch.mentors?.length || 0} mentors ·{" "}
                  {batch.status}
                </p>
              </div>

              {batch.status !== "Completed" && (
                <button
                  onClick={() =>
                    completeBatch(batch)
                  }
                  className="px-4 py-2.5 rounded-xl bg-rose-600 text-white font-black text-sm"
                >
                  Finish Batch
                </button>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}