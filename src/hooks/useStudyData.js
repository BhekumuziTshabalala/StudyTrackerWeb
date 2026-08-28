import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, updateDoc, doc, onSnapshot } from 'firebase/firestore';
import { getDb } from '../firebase';
import { format } from 'date-fns';

export const useStudyData = (isLinked) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLinked) {
      setLoading(false);
      return;
    }

    try {
      const db = getDb();
      // Listen to today's tasks
      const todayStr = format(new Date(), 'yyyy-MM-dd');
      
      const q = query(
        collection(db, 'data', 'shared', 'tasks'),
        where('scheduledDate', '==', todayStr)
      );

      const unsubscribe = onSnapshot(q, async (snapshot) => {
        try {
          const rawTasks = snapshot.docs.map(d => ({ ...d.data(), id: d.id }));
          
          // Need to join with topics and modules for display names
          // In a real app we might denormalize this, but let's fetch related data
          const topicsRef = collection(db, 'data', 'shared', 'topics');
          const topicsSnap = await getDocs(topicsRef);
          const topics = topicsSnap.docs.reduce((acc, d) => ({...acc, [d.id]: d.data()}), {});

          const modulesRef = collection(db, 'data', 'shared', 'modules');
          const modulesSnap = await getDocs(modulesRef);
          const modules = modulesSnap.docs.reduce((acc, d) => ({...acc, [d.id]: d.data()}), {});

          const detailedTasks = rawTasks.map(t => {
            const topic = topics[t.topicId.toString()] || {};
            const module = topic.moduleId ? (modules[topic.moduleId.toString()] || {}) : {};
            
            return {
              ...t,
              topicTitle: topic.title || 'Unknown Topic',
              moduleName: module.name || 'Unknown Module',
              moduleOrderIndex: module.orderIndex ?? 0,
            };
          });

          // Sort by module order index
          detailedTasks.sort((a, b) => a.moduleOrderIndex - b.moduleOrderIndex);
          setTasks(detailedTasks);
          setLoading(false);
        } catch (err) {
          console.error("Error processing tasks", err);
          setError("Failed to load details");
          setLoading(false);
        }
      }, (err) => {
        console.error("Snapshot error:", err);
        setError("Failed to load tasks");
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (err) {
      console.error("Setup error:", err);
      setError("Setup failed");
      setLoading(false);
    }
  }, [isLinked]);

  const toggleTask = async (taskId, currentStatus) => {
    try {
      const db = getDb();
      const taskRef = doc(db, 'data', 'shared', 'tasks', taskId.toString());
      await updateDoc(taskRef, {
        isCompleted: !currentStatus,
        completedAt: !currentStatus ? Date.now() : null
      });
    } catch (err) {
      console.error("Error toggling task", err);
      alert("Failed to update task");
    }
  };

  return { tasks, loading, error, toggleTask };
};
