"use client";

import { useState, useEffect } from "react";
import { ISingerItem } from "./type/singer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Edit, Save, X } from "lucide-react";
import { Plus } from "@phosphor-icons/react/dist/ssr";
import { motion } from "motion/react";
import { MenuBar } from "./menu-bar";

export function SingerManagement() {
  const [singers, setSingers] = useState<ISingerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    singer: "",
    cover: "",
  });

  useEffect(() => {
    fetchSingers();
  }, []);

  const fetchSingers = async () => {
    try {
      const response = await fetch("/api/singers");
      const data = await response.json();
      setSingers(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching singers:", error);
      setLoading(false);
    }
  };

  const handleAddSinger = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/singers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({ singer: "", cover: "" });
        setShowAddForm(false);
        fetchSingers();
      } else {
        const error = await response.json();
        alert(error.error || "Failed to add singer");
      }
    } catch (error) {
      console.error("Error adding singer:", error);
      alert("Failed to add singer");
    }
  };

  const handleUpdateSinger = async (id: string) => {
    try {
      const response = await fetch(`/api/singers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setEditingId(null);
        setFormData({ singer: "", cover: "" });
        fetchSingers();
      } else {
        const error = await response.json();
        alert(error.error || "Failed to update singer");
      }
    } catch (error) {
      console.error("Error updating singer:", error);
      alert("Failed to update singer");
    }
  };

  const handleDeleteSinger = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa ca sĩ này?")) return;

    try {
      const response = await fetch(`/api/singers/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchSingers();
      } else {
        const error = await response.json();
        alert(error.error || "Failed to delete singer");
      }
    } catch (error) {
      console.error("Error deleting singer:", error);
      alert("Failed to delete singer");
    }
  };

  const startEdit = (singer: ISingerItem) => {
    setEditingId(singer._id || singer.id || null);
    setFormData({
      singer: singer.singer,
      cover: singer.cover,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ singer: "", cover: "" });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-zinc-500">Loading singers...</div>
      </div>
    );
  }

  return (
    <div className="mx-4 md:ml-[270px]">
      <MenuBar />

      <div
        className={
          showAddForm
            ? "z-10 font-apple blur-2xl dark:bg-zinc-950"
            : "font-apple"
        }
      >
        <div className="mt-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Artists Management</h2>

            <div
              onClick={() => setShowAddForm(true)}
              className="flex items-center rounded-full bg-blue-400 p-2"
            >
              <Plus size={20} weight="bold" className="text-white" />
            </div>
          </div>

          {/* Add Singer Form */}

          {/* Singers List */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            {singers.map((singer) => (
              <div key={singer._id || singer.id}>
                <div className="rounded-3xl border px-4 py-2 shadow-sm dark:border-zinc-900">
                  <div className="flex items-center gap-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={singer.cover}
                      alt={singer.singer}
                      className="size-16 rounded-full object-cover"
                    />

                    <div className="flex-1">
                      {editingId === (singer._id || singer.id) ? (
                        <div className="space-y-2">
                          <Input
                            value={formData.singer}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                singer: e.target.value,
                              })
                            }
                            placeholder="Tên ca sĩ"
                            className="rounded-xl border bg-white px-4 py-2 shadow-sm disabled:opacity-50 dark:border-zinc-900 dark:bg-zinc-950"
                          />

                          <Input
                            value={formData.cover}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                cover: e.target.value,
                              })
                            }
                            placeholder="URL ảnh bìa"
                            className="rounded-xl border bg-white px-4 py-2 shadow-sm disabled:opacity-50 dark:border-zinc-900 dark:bg-zinc-950"
                          />
                        </div>
                      ) : (
                        <div>
                          <h3 className="font-semibold">{singer.singer}</h3>
                          <p className="text-sm text-zinc-500">
                            {singer.musics?.length || 0} bài hát
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      {editingId === (singer._id || singer.id) ? (
                        <>
                          <Button
                            onClick={() =>
                              handleUpdateSinger(singer._id || singer.id || "")
                            }
                            className="flex items-center gap-1 rounded-full border bg-zinc-50 p-2 dark:border-zinc-800 dark:bg-zinc-950"
                          >
                            <Save size={20} className="text-blue-400" />
                          </Button>

                          <Button
                            variant="outline"
                            onClick={cancelEdit}
                            className="flex items-center gap-1 rounded-full border bg-zinc-50 p-2 dark:border-zinc-800 dark:bg-zinc-950"
                          >
                            <X size={20} className="text-rose-400" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            onClick={() => startEdit(singer)}
                            variant="destructive"
                            className="flex items-center gap-1 rounded-full border bg-zinc-50 p-2 dark:border-zinc-800 dark:bg-zinc-950"
                          >
                            <Edit size={20} className="text-blue-400" />
                          </Button>

                          <Button
                            variant="destructive"
                            onClick={() =>
                              handleDeleteSinger(singer._id || singer.id || "")
                            }
                            className="flex items-center gap-1 rounded-full border bg-zinc-50 p-2 dark:border-zinc-800 dark:bg-zinc-950"
                          >
                            <Trash2 size={20} className="text-rose-400" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {singers.length === 0 && (
            <div className="py-8 text-center text-zinc-500">
              Chưa có ca sĩ nào. Hãy thêm ca sĩ đầu tiên!
            </div>
          )}
        </div>
      </div>

      {/* showAddForm */}
      {showAddForm ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-x-8 top-8 z-30 space-y-4 rounded-3xl border border-zinc-300 bg-zinc-100 to-black/10 p-4 font-apple shadow-sm backdrop-blur-2xl dark:border-zinc-800 dark:bg-zinc-950 dark:to-white/10 md:inset-x-80 md:top-40"
        >
          <div>
            <div className="text-xl font-bold">New Artist</div>
          </div>

          <div className="rounded-lg">
            <form onSubmit={handleAddSinger} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="singer" className="text-sm font-medium">
                  Tên Ca sĩ
                </label>

                <Input
                  id="singer"
                  value={formData.singer}
                  onChange={(e) =>
                    setFormData({ ...formData, singer: e.target.value })
                  }
                  placeholder="Enter artist name"
                  required
                  className="rounded-xl border bg-white px-4 py-2 shadow-sm disabled:opacity-50 dark:border-zinc-900 dark:bg-zinc-950"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="cover" className="text-sm font-medium">
                  URL Ảnh Bìa
                </label>

                <Input
                  id="cover"
                  value={formData.cover}
                  onChange={(e) =>
                    setFormData({ ...formData, cover: e.target.value })
                  }
                  placeholder="https://example.com/avatar.jpg"
                  required
                  className="rounded-xl border bg-white px-4 py-2 shadow-sm disabled:opacity-50 dark:border-zinc-900 dark:bg-zinc-950"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  type="submit"
                  className="flex items-center gap-1 rounded-xl border bg-zinc-50 p-2 dark:border-zinc-800 dark:bg-zinc-950"
                >
                  <Save size={20} className="text-blue-400" />
                  Save
                </Button>

                <Button
                  onClick={() => setShowAddForm(false)}
                  className="flex items-center gap-1 rounded-xl border bg-zinc-50 p-2 text-rose-400 dark:border-zinc-800 dark:bg-zinc-950"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      ) : (
        <motion.div layoutId="form" />
      )}
    </div>
  );
}
