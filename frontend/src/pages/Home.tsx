import React, { useEffect, useMemo, useState } from "react";
import axios from 'axios';
import { useQuery } from 'react-query';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import dayjs from 'dayjs';
import { motion } from 'framer-motion';
import _ from 'lodash';
import clsx from 'clsx';
import { Menu } from '@headlessui/react';
import { Bars3Icon } from '@heroicons/react/24/solid';
// lightweight: avoid heavy chart deps in build; using simple table instead of recharts
import { LucideSettings } from 'lucide-react';
import { io } from 'socket.io-client';
import store from '../store';
import config from "../generated/config";

function runtimeConfig() {
  try {
    const w = window as any;
    if (w && w.__GDPS_CONFIG) return w.__GDPS_CONFIG;
  } catch (e) {}
  return config;
}

  const schema = z.object({
    name: z.string().min(1, 'Name is required'),
  });

  type FormData = z.infer<typeof schema>;

  export default function Home() {
    const [socketConnected, setSocketConnected] = useState(false);
    const [counter, setCounter] = useState(() => store.getState().count);

    useEffect(() => {
      const unsub = store.subscribe(() => setCounter(store.getState().count));
      return unsub;
    }, []);

    useEffect(() => {
      const sock = io(window.location.origin, { autoConnect: true, transports: ['websocket'] });
      sock.on('connect', () => setSocketConnected(true));
      sock.on('disconnect', () => setSocketConnected(false));
      return () => void sock.close();
    }, []);

    const { data: health } = useQuery('health', async () => {
      const r = await axios.get('/api/health');
      return r.data;
    }, { staleTime: 10000 });

    useEffect(() => {
      if (health) {
        toast.success('Backend healthy: ' + (health.status || 'ok'));
      }
    }, [health]);

    const { register, handleSubmit, formState: { errors }, setError } = useForm<FormData>();

    function onSubmit(data: FormData) {
      const parsed = schema.safeParse(data);
      if (!parsed.success) {
        const issues = parsed.error.format();
        if (issues.name && issues.name._errors?.length) {
          setError('name', { type: 'manual', message: String(issues.name._errors[0]) });
        }
        return;
      }
      toast.success(`Hello ${data.name}`);
    }

    const sampleData = useMemo(() => [{ id: 1, name: 'Alice', score: 100 }, { id: 2, name: 'Bob', score: 80 }], []);
    const cloned = _.cloneDeep(sampleData);

    return (
      <div>
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <h1>Home</h1>
          <p>Welcome to the minimal GDPS frontend. Today is {dayjs().format('YYYY-MM-DD HH:mm')}</p>

          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 12 }}>
            <Menu>
              <Menu.Button className="btn btn-secondary"><Bars3Icon style={{ width: 18 }} /></Menu.Button>
              <Menu.Items className="dropdown-menu show" style={{ position: 'absolute' }}>
                <Menu.Item>
                  <button className="dropdown-item">Profile</button>
                </Menu.Item>
              </Menu.Items>
            </Menu>

            <button className={clsx('btn btn-primary')} onClick={() => store.dispatch({ type: 'INCREMENT' })}>
              Increment store ({counter})
            </button>

            <button className="btn btn-outline-secondary" onClick={() => toast('A neutral toast')}>
              <LucideSettings size={16} /> Toast
            </button>
          </div>

          <section style={{ marginTop: 20 }}>
            <h3>Quick form (react-hook-form + zod)</h3>
            <form onSubmit={handleSubmit(onSubmit)}>
              <input className="form-control" {...register('name')} placeholder="Your name" />
              {errors.name && <div style={{ color: 'red' }}>{String(errors.name.message)}</div>}
              <button className="btn btn-success" type="submit" style={{ marginTop: 8 }}>Say hello</button>
            </form>
          </section>

          <section style={{ marginTop: 20 }}>
            <h3>Sample table (tanstack)</h3>
            <table className="table">
              <thead>
                <tr><th>ID</th><th>Name</th><th>Score</th></tr>
              </thead>
              <tbody>
                {cloned.map(r => (
                  <tr key={r.id}><td>{r.id}</td><td>{r.name}</td><td>{r.score}</td></tr>
                ))}
              </tbody>
            </table>
          </section>

          <section style={{ marginTop: 20 }}>
            <h3>Mini stats</h3>
            <div className="card" style={{ padding: 12 }}>
              {sampleData.map(s => (
                <div key={s.id}>{s.name}: {s.score}</div>
              ))}
            </div>
          </section>

          <div style={{ marginTop: 20 }}>
            <strong>Socket:</strong> {socketConnected ? 'connected' : 'disconnected'}
          </div>
        </motion.div>
      </div>
    );
  }
