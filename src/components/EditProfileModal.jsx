// src/components/EditProfileModal.jsx
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { UserSettingsAPI } from "../api/userSettings";

const cx = (...x) => x.filter(Boolean).join(" ");

export default function EditProfileModal({ open, onClose, initial }) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(() => shapeInitial(initial));
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(initial?.avatar || "");

  useEffect(() => {
    if (open) {
      setForm(shapeInitial(initial));
      setAvatarFile(null);
      setAvatarPreview(initial?.avatar || "");
    }
  }, [open, initial]);

  // Close on ESC
  useEffect(() => {
    if (!open) return;
    const onEsc = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  const onOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose?.();
  };

  const onPickAvatar = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setAvatarFile(f);
    const url = URL.createObjectURL(f);
    setAvatarPreview(url);
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      let avatarUrl = initial?.avatar || "";
      if (avatarFile) {
        const res = await UserSettingsAPI.uploadAvatar(avatarFile);
        avatarUrl = res?.url || avatarUrl;
      }
      const payload = {
        fullname: { firstname: form.firstname.trim(), lastname: form.lastname.trim() },
        bio: form.bio,
        location: form.location,
        role: form.role,
        handle: form.handle,
        avatar: avatarUrl,
        skills: splitLines(form.skills),
        goals: splitLines(form.goals),
        socials: splitSocials(form.socials),
      };
      await UserSettingsAPI.updateProfile(payload);
      onClose?.(true);
    } catch (err) {
      console.error("[edit profile] save failed", err);
      onClose?.(false);
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9998] flex items-end md:items-center justify-center bg-black/40 backdrop-blur-[1px]"
      onMouseDown={onOverlayClick}
    >
      {/* Scrollable sheet */}
      <div
        onMouseDown={(e) => e.stopPropagation()}
        className={cx(
          "w-full max-w-lg bg-[#0f1621] border border-white/10 rounded-t-2xl md:rounded-2xl shadow-2xl",
          "transform transition-transform duration-300 ease-out animate-slideUp",
          "max-h-[80vh] flex flex-col"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 shrink-0">
          <h3 className="text-white text-lg font-semibold">Edit Profile</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 text-white/80"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable body */}
        <form
          onSubmit={onSubmit}
          className="px-5 py-5 space-y-5 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent flex-1"
        >
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gray-800 overflow-hidden ring-1 ring-white/20">
              {avatarPreview ? (
                <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full grid place-items-center text-white/60 text-2xl">👤</div>
              )}
            </div>
            <div>
              <label className="block text-sm text-white/80 mb-1">Avatar</label>
              <input
                type="file"
                accept="image/*"
                onChange={onPickAvatar}
                className="block text-sm text-white/80 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border file:border-white/10 file:bg-white/10 file:text-white hover:file:bg-white/20"
              />
            </div>
          </div>

          {/* Form fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="First name" name="firstname" value={form.firstname} onChange={onChange} required />
            <Field label="Last name" name="lastname" value={form.lastname} onChange={onChange} />
          </div>
          <Field label="Handle" name="handle" value={form.handle} onChange={onChange} placeholder="@username" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Role" name="role" value={form.role} onChange={onChange} />
            <Field label="Location" name="location" value={form.location} onChange={onChange} />
          </div>
          <TextArea label="Bio" name="bio" value={form.bio} onChange={onChange} rows={3} />
          <Field label="Skills (comma or newline)" name="skills" value={form.skills} onChange={onChange} />
          <TextArea label="Goals (one per line)" name="goals" value={form.goals} onChange={onChange} rows={3} />
          <TextArea
            label="Socials (one per line: Label|URL)"
            name="socials"
            value={form.socials}
            onChange={onChange}
            rows={3}
          />

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-3 sticky bottom-0 bg-[#0f1621]">
            <button
              type="button"
              onClick={onClose}
              className="h-10 px-4 rounded-lg bg-white/10 border border-white/10 text-white hover:bg-white/20"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="h-10 px-5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}

/* ---------- small inputs ---------- */
function shapeInitial(u = {}) {
  const first = u?.fullname?.firstname ?? u?.firstname ?? "";
  const last = u?.fullname?.lastname ?? u?.lastname ?? "";
  return {
    firstname: first,
    lastname: last,
    handle: u?.handle ?? (u?.email ? `@${u.email.split("@")[0]}` : ""),
    role: u?.role ?? "",
    location: u?.location ?? "",
    bio: u?.bio ?? "",
    skills: Array.isArray(u?.skills) ? u.skills.join(", ") : "",
    goals: Array.isArray(u?.goals) ? u.goals.join("\n") : "",
    socials: Array.isArray(u?.socials) ? u.socials.map((s) => `${s.label}|${s.url}`).join("\n") : "",
  };
}
function splitLines(s = "") {
  return s.split(/\n|,/).map((x) => x.trim()).filter(Boolean);
}
function splitSocials(s = "") {
  return s
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, url] = line.split("|").map((x) => x.trim());
      return label && url ? { label, url } : null;
    })
    .filter(Boolean);
}
function Field({ label, name, value, onChange, ...rest }) {
  return (
    <label className="block">
      <span className="block text-sm text-white/80 mb-1">{label}</span>
      <input
        name={name}
        value={value}
        onChange={onChange}
        className="w-full h-11 rounded-xl bg-[#0f1621] border border-white/10 px-3 text-white placeholder-white/40 focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500/60 outline-none"
        {...rest}
      />
    </label>
  );
}
function TextArea({ label, name, value, onChange, rows = 3, ...rest }) {
  return (
    <label className="block">
      <span className="block text-sm text-white/80 mb-1">{label}</span>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
        className="w-full rounded-xl bg-[#0f1621] border border-white/10 px-3 py-2 text-white placeholder-white/40 focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500/60 outline-none resize-y"
        {...rest}
      />
    </label>
  );
}

/* ---------- animations ---------- */
/* in global.css:
@keyframes slideUp {
  from { transform: translateY(100%); opacity:0; }
  to   { transform: translateY(0); opacity:1; }
}
.animate-slideUp { animation: slideUp 300ms ease-out; }
*/
