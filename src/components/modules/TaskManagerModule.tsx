import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ListTodo, Plus, Trash2, CheckCircle2, Circle, Clock, Tag } from 'lucide-react';
import { Task } from '../../types';

export const TaskManagerModule: React.FC = () => {
  const { tasks, addTask, updateTaskStatus, deleteTask, showToast } = useApp();

  const [title, setTitle] = useState('');
  const [clientName, setClientName] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Task title is required', 'error');
      return;
    }

    const newTask: Task = {
      id: 'task_' + Date.now(),
      title,
      clientName: clientName || 'General',
      dueDate: dueDate || 'Today',
      status: 'todo',
      priority,
      createdAt: new Date().toLocaleDateString(),
    };

    addTask(newTask);
    setTitle('');
    setClientName('');
    showToast('Task added!');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center gap-3 p-6 bg-slate-900/80 border border-slate-800 rounded-3xl">
        <div className="p-3 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
          <ListTodo className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Freelance Task Manager</h1>
          <p className="text-xs text-slate-400">
            Organize project deliverables, client revisions, and upcoming deadlines.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* New Task Form */}
        <form onSubmit={handleAddTask} className="lg:col-span-4 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Plus className="w-4 h-4 text-indigo-400" /> Add New Task
          </h2>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Task Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Send React API milestone demo"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Client Name</label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="e.g. Sarah / SaaSify"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-2xl transition shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add Task
          </button>
        </form>

        {/* Task List */}
        <div className="lg:col-span-8 bg-slate-900/80 border border-slate-800 rounded-3xl p-6">
          <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-4">
            Active Tasks ({tasks.filter((t) => t.status !== 'completed').length})
          </h2>

          <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`p-3.5 rounded-2xl border transition flex items-center justify-between gap-3 ${
                  task.status === 'completed'
                    ? 'bg-slate-950/40 border-slate-800/50 opacity-60'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <button
                    onClick={() =>
                      updateTaskStatus(task.id, task.status === 'completed' ? 'todo' : 'completed')
                    }
                    className="text-slate-400 hover:text-indigo-400 transition"
                  >
                    {task.status === 'completed' ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>

                  <div className="truncate">
                    <p
                      className={`text-xs font-bold truncate ${
                        task.status === 'completed' ? 'line-through text-slate-500' : 'text-slate-200'
                      }`}
                    >
                      {task.title}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      Client: {task.clientName} • Due: {task.dueDate}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      task.priority === 'high'
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        : task.priority === 'medium'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                    }`}
                  >
                    {task.priority}
                  </span>

                  <button
                    onClick={() => deleteTask(task.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
