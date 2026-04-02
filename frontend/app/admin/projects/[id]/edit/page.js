"use client";
import ProjectForm from '@/components/admin/ProjectForm';
import { useParams } from 'next/navigation';

export default function EditProject() {
  const { id } = useParams();
  return <ProjectForm id={id} />;
}
