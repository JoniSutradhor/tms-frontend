import React, { useEffect, useState } from "react";
// @ts-ignore
import {
  getTeams,
  deleteTeam,
  bulkDeleteTeams,
  reorderTeams,
  updateMember,
  deleteMember,
} from "../api/teamService";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import StatusControl from "../components/StatusControl";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

interface Member {
  _id?: string;
  name: string;
  gender?: string;
  dateOfBirth?: string;
  contactNo?: string;
}

interface Team {
  _id: string;
  name: string;
  description?: string;
  members?: Member[];
  managerStatus?: string;
  directorStatus?: string;
}

interface EditingMember {
  teamId: string;
  memberId: string | number;
}

interface SortableRowProps {
  team: Team;
  index: number;
  selected: string[];
  expandedTeams: Set<string>;
  editingMember: EditingMember | null;
  memberName: string;
  isDragDisabled: boolean;
  onToggleExpand: (teamId: string) => void;
  onToggleSelect: (teamId: string) => void;
  onEdit: (teamId: string) => void;
  onDelete: (teamId: string) => void;
  onEditMember: (
    teamId: string,
    memberId: string | number,
    name: string
  ) => void;
  onSaveMember: (teamId: string, memberId: string | number) => void;
  onDeleteMember: (teamId: string, memberId: string | number) => void;
  onCancelEditMember: () => void;
  onMemberNameChange: (value: string) => void;
}

function SortableRow({
  team,
  selected,
  expandedTeams,
  editingMember,
  memberName,
  isDragDisabled,
  onToggleExpand,
  onToggleSelect,
  onEdit,
  onDelete,
  onEditMember,
  onSaveMember,
  onDeleteMember,
  onCancelEditMember,
  onMemberNameChange,
}: SortableRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: team._id,
    disabled: isDragDisabled,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <>
      <tr
        ref={setNodeRef}
        style={style}
        className={`team-row ${isDragging ? "dragging" : ""}`}
      >
        <td className="col-expand">
          <div className="expand-controls">
            <span
              className="drag-handle"
              {...attributes}
              {...listeners}
              style={{
                opacity: isDragDisabled ? 0.3 : 1,
                cursor: isDragDisabled ? "not-allowed" : "grab",
              }}
            >
              ⋮⋮
            </span>
            {team.members && team.members.length > 0 && (
              <button
                className="btn-expand"
                onClick={() => onToggleExpand(team._id)}
              >
                {expandedTeams.has(team._id) ? "▼" : "▶"}
              </button>
            )}
          </div>
        </td>
        <td className="col-checkbox">
          <input
            type="checkbox"
            checked={selected.includes(team._id)}
            onChange={() => onToggleSelect(team._id)}
          />
        </td>
        <td className="col-team-name">{team.name}</td>
        <td className="col-status">
          <StatusControl
            teamId={team._id}
            field="managerStatus"
            initial={team.managerStatus}
          />
        </td>
        <td className="col-status">
          <StatusControl
            teamId={team._id}
            field="directorStatus"
            initial={team.directorStatus}
          />
        </td>
        <td className="col-actions">
          <button
            className="btn-action btn-edit"
            onClick={() => onEdit(team._id)}
          >
            Edit
          </button>
          <span className="action-separator">|</span>
          <button
            className="btn-action btn-delete"
            onClick={() => onDelete(team._id)}
          >
            Delete
          </button>
        </td>
      </tr>
      {expandedTeams.has(team._id) &&
        team.members &&
        team.members.map((member, idx) => (
          <tr key={`${team._id}-member-${idx}`} className="member-row">
            <td colSpan={2}></td>
            <td className="member-name-cell">
              {editingMember?.teamId === team._id &&
              editingMember?.memberId === (member._id || idx) ? (
                <input
                  type="text"
                  className="member-name-input"
                  value={memberName}
                  onChange={(e) => onMemberNameChange(e.target.value)}
                  onBlur={() => onSaveMember(team._id, member._id || idx)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      onSaveMember(team._id, member._id || idx);
                    }
                  }}
                  autoFocus
                />
              ) : (
                <span className="member-name">{member.name}</span>
              )}
            </td>
            <td colSpan={2}></td>
            <td className="col-actions">
              {editingMember?.teamId === team._id &&
              editingMember?.memberId === (member._id || idx) ? (
                <>
                  <button
                    className="btn-action btn-save"
                    onClick={() => onSaveMember(team._id, member._id || idx)}
                  >
                    Save
                  </button>
                  <span className="action-separator">|</span>
                  <button
                    className="btn-action btn-cancel"
                    onClick={onCancelEditMember}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="btn-action btn-edit"
                    onClick={() =>
                      onEditMember(team._id, member._id || idx, member.name)
                    }
                  >
                    Edit
                  </button>
                  <span className="action-separator">|</span>
                  <button
                    className="btn-action btn-delete"
                    onClick={() => onDeleteMember(team._id, member._id || idx)}
                  >
                    Delete
                  </button>
                </>
              )}
            </td>
          </tr>
        ))}
    </>
  );
}

export default function TeamListPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [expandedTeams, setExpandedTeams] = useState(new Set<string>());
  const [editingMember, setEditingMember] = useState<EditingMember | null>(
    null
  );
  const [memberName, setMemberName] = useState("");
  const navigate = useNavigate();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const fetchTeams = async () => {
    setLoading(true);
    try {
      const res = await getTeams();
      setTeams(res.data);
    } catch {
      toast.error("Failed to fetch teams");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this team?")) {
      setLoading(true);
      try {
        await deleteTeam(id);
        toast.success("Team deleted successfully");
        fetchTeams();
      } catch {
        toast.error("Failed to delete team");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBulkDelete = async () => {
    if (
      window.confirm(
        `Are you sure you want to delete ${selected.length} selected team(s)?`
      )
    ) {
      setLoading(true);
      try {
        await bulkDeleteTeams(selected);
        setSelected([]);
        toast.success("Teams deleted successfully");
        fetchTeams();
      } catch {
        toast.error("Failed to delete teams");
      } finally {
        setLoading(false);
      }
    }
  };

  const toggleExpand = (teamId: string) => {
    const newExpanded = new Set(expandedTeams);
    if (newExpanded.has(teamId)) {
      newExpanded.delete(teamId);
    } else {
      newExpanded.add(teamId);
    }
    setExpandedTeams(newExpanded);
  };

  const toggleSelect = (teamId: string) => {
    setSelected((prev) =>
      prev.includes(teamId)
        ? prev.filter((id) => id !== teamId)
        : [...prev, teamId]
    );
  };

  const handleEditMember = (
    teamId: string,
    memberId: string | number,
    currentName: string
  ) => {
    setEditingMember({ teamId, memberId });
    setMemberName(currentName);
  };

  const handleSaveMember = async (
    teamId: string,
    memberId: string | number
  ) => {
    if (!memberName.trim()) {
      toast.error("Member name cannot be empty");
      return;
    }
    setLoading(true);
    try {
      await updateMember(teamId, memberId, { name: memberName });
      toast.success("Member updated successfully");
      setEditingMember(null);
      fetchTeams();
    } catch {
      toast.error("Failed to update member");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMember = async (
    teamId: string,
    memberId: string | number
  ) => {
    if (window.confirm("Are you sure you want to delete this member?")) {
      setLoading(true);
      try {
        await deleteMember(teamId, memberId);
        toast.success("Member deleted successfully");
        fetchTeams();
      } catch {
        toast.error("Failed to delete member");
      } finally {
        setLoading(false);
      }
    }
  };

  const filtered = teams.filter(
    (t: Team) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      (t.members &&
        t.members.some((m: Member) =>
          m.name.toLowerCase().includes(search.toLowerCase())
        ))
  );

  const displayedTeams = search ? filtered : teams;
  const isDragDisabled = search.length > 0;

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = teams.findIndex((team) => team._id === active.id);
      const newIndex = teams.findIndex((team) => team._id === over.id);

      const reordered = arrayMove(teams, oldIndex, newIndex);
      setTeams(reordered);

      try {
        await reorderTeams(reordered.map((t) => t._id));
        toast.success("Team order saved successfully");
      } catch {
        toast.error("Failed to save order");
        fetchTeams();
      }
    }
  };

  const toggleSelectAll = () => {
    if (selected.length === filtered.length) {
      setSelected([]);
    } else {
      setSelected(filtered.map((t: Team) => t._id));
    }
  };

  return (
    <div className="team-management-container">
      <div className="header-section">
        <h2 className="page-title">TeamStatus</h2>
        <button className="btn-new-team" onClick={() => navigate("/team/new")}>
          New Team
        </button>
      </div>

      <div className="search-section">
        <input
          className="search-input"
          placeholder="Search team"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn-search">
          <MagnifyingGlassIcon className="h-5 w-5" />
        </button>
      </div>

      {search && (
        <div
          style={{
            padding: "10px",
            background: "#fff3cd",
            borderRadius: "5px",
            marginBottom: "10px",
            fontSize: "14px",
          }}
        >
          ℹ️ Drag & drop is disabled during search. Clear search to reorder
          teams.
        </div>
      )}

      {selected.length > 0 && (
        <button className="btn-delete-all" onClick={handleBulkDelete}>
          Delete All
        </button>
      )}

      {loading ? (
        <Loader />
      ) : (
        <div className="table-container">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={displayedTeams.map((t) => t._id)}
              strategy={verticalListSortingStrategy}
            >
              <table className="team-table">
                <thead>
                  <tr>
                    <th className="col-expand"></th>
                    <th className="col-checkbox">
                      <input
                        type="checkbox"
                        checked={
                          filtered.length > 0 &&
                          selected.length === filtered.length
                        }
                        onChange={toggleSelectAll}
                      />
                    </th>
                    <th className="col-team-name">Team Name</th>
                    <th className="col-status">
                      Approved
                      <br />
                      by Manager
                    </th>
                    <th className="col-status">
                      Approved
                      <br />
                      by Director
                    </th>
                    <th className="col-actions"></th>
                  </tr>
                </thead>
                <tbody>
                  {displayedTeams.map((team, index) => (
                    <SortableRow
                      key={team._id}
                      team={team}
                      index={index}
                      selected={selected}
                      expandedTeams={expandedTeams}
                      editingMember={editingMember}
                      memberName={memberName}
                      isDragDisabled={isDragDisabled}
                      onToggleExpand={toggleExpand}
                      onToggleSelect={toggleSelect}
                      onEdit={(id) => navigate(`/team/${id}`)}
                      onDelete={handleDelete}
                      onEditMember={handleEditMember}
                      onSaveMember={handleSaveMember}
                      onDeleteMember={handleDeleteMember}
                      onCancelEditMember={() => setEditingMember(null)}
                      onMemberNameChange={setMemberName}
                    />
                  ))}
                </tbody>
              </table>
            </SortableContext>
          </DndContext>
        </div>
        // <div className="table-container">
        //   <table className="team-table">
        //     <thead>
        //       <tr>
        //         <th className="col-expand"></th>
        //         <th className="col-checkbox">
        //           <input
        //             type="checkbox"
        //             checked={filtered.length > 0 && selected.length === filtered.length}
        //             onChange={toggleSelectAll}
        //           />
        //         </th>
        //         <th className="col-team-name">Team Name</th>
        //         <th className="col-status">Approved<br/>by Manager</th>
        //         <th className="col-status">Approved<br/>by Director</th>
        //         <th className="col-actions"></th>
        //       </tr>
        //     </thead>
        //     <DndContext
        //       sensors={sensors}
        //       collisionDetection={closestCenter}
        //       onDragEnd={handleDragEnd}
        //     >
        //       <SortableContext
        //         items={displayedTeams.map(t => t._id)}
        //         strategy={verticalListSortingStrategy}
        //       >
        //         <tbody>
        //           {displayedTeams.map((team, index) => (
        //             <SortableRow
        //               key={team._id}
        //               team={team}
        //               index={index}
        //               selected={selected}
        //               expandedTeams={expandedTeams}
        //               editingMember={editingMember}
        //               memberName={memberName}
        //               isDragDisabled={isDragDisabled}
        //               onToggleExpand={toggleExpand}
        //               onToggleSelect={toggleSelect}
        //               onEdit={(id) => navigate(`/team/${id}`)}
        //               onDelete={handleDelete}
        //               onEditMember={handleEditMember}
        //               onSaveMember={handleSaveMember}
        //               onDeleteMember={handleDeleteMember}
        //               onCancelEditMember={() => setEditingMember(null)}
        //               onMemberNameChange={setMemberName}
        //             />
        //           ))}
        //         </tbody>
        //       </SortableContext>
        //     </DndContext>
        //   </table>
        // </div>
      )}
    </div>
  );
}
