import React, { useState } from "react";
// @ts-ignore
import { updateStatus } from "../api/teamService";
import { toast } from "react-toastify";

interface StatusControlProps {
  teamId: string;
  field: string;
  initial?: string;
}

const StatusControl: React.FC<StatusControlProps> = ({
  teamId,
  field,
  initial,
}) => {
  const states = ["none", "approved", "rejected"];
  const [status, setStatus] = useState(initial || "none");

  const handleClick = async () => {
    const next = states[(states.indexOf(status) + 1) % 3];
    setStatus(next);
    try {
      await updateStatus(teamId, field, next);
      toast.success("Team Status Saved");
    } catch {
      toast.error("Error saving status");
    }
  };

  const tooltip: Record<string, string> = {
    none: "No Action Taken",
    approved: "Approved",
    rejected: "Not Approved",
  };

  return (
    <div
      className="status-circle-container"
      onClick={handleClick}
      title={tooltip[status]}
    >
      <div className={`status-circle status-${status}`}>
        {status === "approved" && <span className="checkmark">✓</span>}
        {status === "rejected" && <span className="crossmark">✕</span>}
      </div>
    </div>
  );
};

export default StatusControl;
