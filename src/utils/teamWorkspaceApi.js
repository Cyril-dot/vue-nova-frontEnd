// teamWorkspaceApi.js  — mirrors every endpoint in TeamWorkSpaceController
import { apiRequest } from '@/utils/apiService';

export const TeamWorkspaceAPI = {

  // ── CREATE + TEMPLATE (atomic from the frontend's perspective) ────────
  // Step 1 → POST /create/{teamId}          : creates the workspace record
  // Step 2 → POST /template/{teamId}/{id}   : stamps it with a starter template
  // Both steps run synchronously; the caller always receives a fully-initialised
  // workspace — workSpaceData / content is guaranteed non-null.
  async createWorkspaceWithTemplate(teamId, { title, description, docType }) {
    // ── Step 1: create the bare workspace ──────────────────────────────
    const createRes = await apiRequest(`/v1/team/workspace/create/${teamId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description }),
    });
    if (!createRes.ok) {
      const msg = await createRes.text();
      throw new Error(msg || 'Failed to create workspace');
    }
    const created = await createRes.json();   // { id, title, description, … }

    // ── Step 2: stamp with a starter template ──────────────────────────
    const templateRes = await apiRequest(
      `/v1/team/workspace/template/${teamId}/${created.id}?docType=${docType}`,
      { method: 'POST' },
    );
    if (!templateRes.ok) {
      const msg = await templateRes.text();
      throw new Error(msg || 'Workspace created but template failed');
    }
    return templateRes.json();   // returns ActiveWorkSpaceDocs with content set
  },

  // ── List all workspaces for a team ───────────────────────────────────
  async getAllWorkspaces(teamId) {
    const res = await apiRequest(`/v1/team/workspace/all/${teamId}`, { method: 'GET' });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  // ── View single workspace ────────────────────────────────────────────
  async viewWorkspace(teamId, docId) {
    const res = await apiRequest(`/v1/team/workspace/view/${teamId}/${docId}`, { method: 'GET' });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  // ── Add / replace template on an existing workspace (admin) ──────────
  async createTemplate(teamId, docId, docType) {
    const res = await apiRequest(
      `/v1/team/workspace/template/${teamId}/${docId}?docType=${docType}`,
      { method: 'POST' },
    );
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  // ── Work in doc — replaces content (admin) ───────────────────────────
  async workInWorkspace(teamId, docId, content) {
    const res = await apiRequest(`/v1/team/workspace/work/${teamId}/${docId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  // ── Continue (append) — admin ────────────────────────────────────────
  async continueWork(teamId, docId, content) {
    const res = await apiRequest(`/v1/team/workspace/continue/${teamId}/${docId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  // ── Submit contribution (any member) ─────────────────────────────────
  async submitContribution(teamId, docId, content) {
    const res = await apiRequest(`/v1/team/workspace/contribute/${teamId}/${docId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  // ── View pending contributions (admin) ───────────────────────────────
  async getPendingContributions(teamId, workspaceId) {
    const res = await apiRequest(`/v1/team/workspace/pending/${teamId}/${workspaceId}`, { method: 'GET' });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  // ── Approve contribution (admin) ─────────────────────────────────────
  async approveContribution(teamId, contributionId) {
    const res = await apiRequest(`/v1/team/workspace/approve/${teamId}/${contributionId}`, { method: 'PATCH' });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  // ── Reject contribution (admin) ──────────────────────────────────────
  async rejectContribution(teamId, contributionId, reason) {
    const res = await apiRequest(
      `/v1/team/workspace/reject/${teamId}/${contributionId}?reason=${encodeURIComponent(reason)}`,
      { method: 'PATCH' },
    );
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  // ── Delete workspace (admin) ─────────────────────────────────────────
  async deleteWorkspace(teamId, docId) {
    const res = await apiRequest(`/v1/team/workspace/delete/${teamId}/${docId}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(await res.text());
    return res.text();
  },

  // ── Download single workspace ────────────────────────────────────────
  async downloadWorkspace(teamId, docId) {
    const res = await apiRequest(`/v1/team/workspace/download/${teamId}/${docId}`, { method: 'GET' });
    if (!res.ok) throw new Error('Download failed');
    const blob = await res.blob();
    const cd   = res.headers.get('content-disposition') || '';
    const name = cd.match(/filename="?([^"]+)"?/)?.[1] || 'workspace.txt';
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = name; a.click();
    URL.revokeObjectURL(url);
  },

  // ── Download all workspaces as ZIP ───────────────────────────────────
  async downloadAllWorkspaces(teamId) {
    const res = await apiRequest(`/v1/team/workspace/download-all/${teamId}`, { method: 'GET' });
    if (res.status === 204) throw new Error('No workspaces to download');
    if (!res.ok) throw new Error('Download failed');
    const blob = await res.blob();
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = `team_${teamId}_workspaces.zip`; a.click();
    URL.revokeObjectURL(url);
  },
};