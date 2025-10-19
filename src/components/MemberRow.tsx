import React from "react";

interface MemberRowProps {
  member: {
    name: string;
    gender: string;
    dateOfBirth: string;
    contactNo: string;
  };
  index: number;
  onChange: (index: number, field: string, value: string) => void;
  onRemove: (index: number) => void;
  errors: Record<string, string>;
  showRemove: boolean;
}

const MemberRow: React.FC<MemberRowProps> = ({
  member,
  index,
  onChange,
  onRemove,
  errors,
  showRemove,
}) => {
  return (
    <tr className="member-table-row">
      <td>
        <input
          type="text"
          className={`member-input ${
            errors[`member_${index}_name`] ? "input-error" : ""
          }`}
          value={member.name}
          onChange={(e) => onChange(index, "name", e.target.value)}
          placeholder="Single line textbox"
        />
        {errors[`member_${index}_name`] && (
          <div className="field-error">{errors[`member_${index}_name`]}</div>
        )}
      </td>
      <td>
        <select
          className={`member-select ${
            errors[`member_${index}_gender`] ? "input-error" : ""
          }`}
          value={member.gender}
          onChange={(e) => onChange(index, "gender", e.target.value)}
        >
          <option value="">Dropdown List</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        {errors[`member_${index}_gender`] && (
          <div className="field-error">{errors[`member_${index}_gender`]}</div>
        )}
      </td>
      <td>
        <input
          type="date"
          className={`member-input ${
            errors[`member_${index}_dateOfBirth`] ? "input-error" : ""
          }`}
          value={member.dateOfBirth}
          onChange={(e) => onChange(index, "dateOfBirth", e.target.value)}
          placeholder="dd MMM yyyy"
        />
        {errors[`member_${index}_dateOfBirth`] && (
          <div className="field-error">
            {errors[`member_${index}_dateOfBirth`]}
          </div>
        )}
      </td>
      <td>
        <input
          type="tel"
          className={`member-input ${
            errors[`member_${index}_contactNo`] ? "input-error" : ""
          }`}
          value={member.contactNo}
          onChange={(e) => {
            const value = e.target.value.replace(/[^0-9]/g, "");
            onChange(index, "contactNo", value);
          }}
          placeholder="Number only"
          pattern="[0-9]*"
        />
        {errors[`member_${index}_contactNo`] && (
          <div className="field-error">
            {errors[`member_${index}_contactNo`]}
          </div>
        )}
      </td>
      <td className="action-cell">
        {showRemove && (
          <button
            type="button"
            className="btn-remove-row"
            onClick={() => onRemove(index)}
            title="Remove member"
          >
            ✕
          </button>
        )}
      </td>
    </tr>
  );
};

export default MemberRow;
