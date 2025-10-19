import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
// @ts-ignore
import { createTeam, updateTeam } from "../api/teamService";
import axios from "axios";
import MemberRow from "../components/MemberRow";

interface Member {
  name: string;
  gender: string;
  dateOfBirth: string;
  contactNo: string;
}

const TeamFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [teamData, setTeamData] = useState({
    name: "",
    description: "",
    members: [
      { name: "", gender: "", dateOfBirth: "", contactNo: "" },
    ] as Member[],
  });

  useEffect(() => {
    if (id) {
      setLoading(true);
      axios
        .get(`http://localhost:5000/api/teams/${id}`)
        .then((res) => {
          const data = res.data;
          const normalizedMembers = data.members?.map((m: any) => ({
            name: m.name || "",
            gender: m.gender || "",
            dateOfBirth: m.dateOfBirth ? m.dateOfBirth.split("T")[0] : "",
            contactNo: m.contactNo || "",
          })) || [{ name: "", gender: "", dateOfBirth: "", contactNo: "" }];

          setTeamData({
            name: data.name || "",
            description: data.description || "",
            members: normalizedMembers,
          });
        })
        .catch((err) => {
          console.error(err);
          toast.error("Failed to load team data");
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setTeamData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleMemberChange = (index: number, field: string, value: string) => {
    const updatedMembers = [...teamData.members];
    updatedMembers[index] = { ...updatedMembers[index], [field]: value };
    setTeamData({ ...teamData, members: updatedMembers });
    const errorKey = `member_${index}_${field}`;
    if (errors[errorKey]) {
      setErrors((prev) => ({ ...prev, [errorKey]: "" }));
    }
  };

  const addMember = () => {
    setTeamData((prev) => ({
      ...prev,
      members: [
        ...prev.members,
        { name: "", gender: "", dateOfBirth: "", contactNo: "" },
      ],
    }));
  };

  const removeMember = (index: number) => {
    if (teamData.members.length === 1) {
      toast.error("At least one member is required");
      return;
    }
    const updatedMembers = teamData.members.filter((_, i) => i !== index);
    setTeamData({ ...teamData, members: updatedMembers });
    const newErrors = { ...errors };
    ["name", "gender", "dateOfBirth", "contactNo"].forEach((field) => {
      delete newErrors[`member_${index}_${field}`];
    });
    setErrors(newErrors);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!teamData.name.trim()) {
      newErrors.name = "Team name is required";
    }
    if (!teamData.description.trim()) {
      newErrors.description = "Team description is required";
    }

    teamData.members.forEach((member, index) => {
      if (!member.name.trim()) {
        newErrors[`member_${index}_name`] = "Name is required";
      }
      if (!member.gender) {
        newErrors[`member_${index}_gender`] = "Gender is required";
      }
      if (!member.dateOfBirth) {
        newErrors[`member_${index}_dateOfBirth`] = "Date of birth is required";
      }
      if (!member.contactNo.trim()) {
        newErrors[`member_${index}_contactNo`] = "Contact number is required";
      } else if (member.contactNo.length < 10) {
        newErrors[`member_${index}_contactNo`] =
          "Contact number must be at least 10 digits";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }

    const action = id ? "update" : "create";
    const confirmMessage = id
      ? "Are you sure you want to update this team?"
      : "Are you sure you want to create this team?";

    if (!window.confirm(confirmMessage)) {
      return;
    }

    setSaving(true);
    try {
      if (id) {
        await updateTeam(id, teamData);
        toast.success("Team updated successfully!");
      } else {
        await createTeam(teamData);
        toast.success("Team created successfully!");
      }
      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error(`Failed to ${action} team. Please try again.`);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm("Are you sure you want to exit without saving?")) {
      navigate("/");
    }
  };

  if (loading) {
    return (
      <div className="form-loader">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="team-details-container">
      <div className="team-details-card">
        <div className="team-details-header">
          <h2>Team Details</h2>
        </div>

        <div className="team-details-body">
          {/* Team Name Field */}
          <div className="field-section">
            <label className="field-label">Team Name</label>
            <input
              type="text"
              name="name"
              className={`field-input ${errors.name ? "input-error" : ""}`}
              value={teamData.name}
              onChange={handleChange}
              placeholder="Single line textbox"
            />
            {errors.name && <div className="field-error">{errors.name}</div>}
          </div>

          {/* Team Description Field */}
          <div className="field-section">
            <label className="field-label">Team Description</label>
            <textarea
              name="description"
              className={`field-textarea ${
                errors.description ? "input-error" : ""
              }`}
              value={teamData.description}
              onChange={handleChange}
              placeholder="Multiple line textbox"
              rows={4}
            />
            {errors.description && (
              <div className="field-error">{errors.description}</div>
            )}
          </div>

          {/* Team Member Section */}
          <div className="field-section">
            <label className="field-label">Team Member</label>
            <div className="member-table-container">
              <table className="member-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Gender</th>
                    <th>Date of Birth</th>
                    <th>Contact No.</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {teamData.members.map((member, index) => (
                    <MemberRow
                      key={index}
                      member={member}
                      index={index}
                      onChange={handleMemberChange}
                      onRemove={removeMember}
                      errors={errors}
                      showRemove={teamData.members.length > 1}
                    />
                  ))}
                </tbody>
              </table>
            </div>
            <button
              type="button"
              className="btn-add-new-member"
              onClick={addMember}
            >
              Add New Member
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="team-details-actions">
          <button
            type="button"
            className="btn-save"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? (
              <>
                <span
                  className="spinner-border spinner-sm"
                  role="status"
                ></span>
                <span className="ms-2">Saving...</span>
              </>
            ) : (
              "Save"
            )}
          </button>
          <button
            type="button"
            className="btn-exit"
            onClick={handleCancel}
            disabled={saving}
          >
            Exit
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeamFormPage;
