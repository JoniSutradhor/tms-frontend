# Team Management System

A comprehensive team management application built with React, TypeScript, and Vite. This application provides full CRUD operations for managing teams with advanced features like drag-and-drop, approval workflows, and inline editing.

## 🚀 Features

### 1. **Complete CRUD Operations**
- ✅ **Create**: Add new teams with validation
- ✅ **Read**: View all teams in a responsive table
- ✅ **Update**: Edit team details through dedicated form page
- ✅ **Delete**: Remove teams with confirmation dialogs
- ✅ **Bulk Delete**: Select and delete multiple teams at once

### 2. **Three-State Approval System**
- **Gray Circle**: No action taken (initial state)
- **Green Checkmark**: Approved status
- **Red Cross**: Not approved/rejected status
- Click to cycle through states: None → Approved → Rejected → None
- Separate approval controls for Manager and Director
- Hover tooltips showing current status
- Auto-save on each status change with success notifications

### 3. **Drag-and-Drop Reordering**
- Drag teams to reorder them in the table
- Visual drag handle (⋮⋮) for easy grabbing
- Automatic save to database on drop
- Smooth animations during drag operations

### 4. **Master-Detail View**
- Expandable rows to show/hide team members
- Click arrow (▶/▼) to toggle member visibility
- Inline member name editing
- Delete members with confirmation
- Nested member rows with distinct styling

### 5. **Advanced Search**
- Real-time search filtering
- Searches both team names and member names
- Case-insensitive matching
- Updates table instantly as you type

### 6. **Bulk Operations**
- Checkbox selection for individual teams
- Select all/deselect all functionality
- "Delete All" button appears only when items are selected
- Confirmation dialog shows count of selected items

### 7. **Form Validation**
- Required field validation for team name, department, and manager
- Member name validation
- Real-time error messages
- Visual error indicators (red borders)
- Prevents submission until all errors are resolved

### 8. **Loading States**
- Progress spinner during API calls
- Loading state for form data fetching
- Disabled buttons during save operations
- Loading indicators on page load

### 9. **Confirmation Dialogs**
- Confirm before creating new team
- Confirm before updating existing team
- Confirm before deleting team
- Confirm before bulk deleting teams
- Confirm before deleting members
- Confirm before removing member from form
- Confirm before exiting form without saving

### 10. **Responsive Design**
- Mobile-friendly table layout
- Adapts to tablet and desktop screens
- Horizontal scroll for small screens
- Responsive header and buttons
- Touch-friendly controls

## 🎨 UI/UX Features

- **Clean Modern Design**: Professional blue and orange color scheme
- **Smooth Animations**: Hover effects, transitions, and animations
- **Intuitive Icons**: Visual indicators for all actions
- **Clear Typography**: Readable fonts and proper hierarchy
- **Accessible Controls**: Keyboard navigation support
- **Toast Notifications**: Success and error messages
- **Visual Feedback**: Hover states, active states, disabled states

## 📋 Technical Implementation

### Technology Stack
- **React 18**: Modern React with hooks
- **TypeScript**: Type-safe development
- **React Router**: Client-side routing
- **React Beautiful DnD**: Drag and drop functionality
- **React Toastify**: Toast notifications
- **Axios**: HTTP client for API calls
- **Vite**: Fast build tool and dev server

### Project Structure
```
src/
├── api/
│   ├── teamService.js          # API service layer
│   └── teamService.d.ts        # TypeScript definitions
├── components/
│   ├── Loader.tsx              # Loading spinner component
│   ├── MemberRow.tsx           # Team member row component (used)
│   ├── StatusControl.tsx       # Three-state approval control
│   ├── TeamRow.tsx             # Individual team row (empty)
│   └── TeamTable.tsx           # Table component (empty)
├── pages/
│   ├── TeamListPage.tsx        # Main team list with table
│   └── TeamFormPage.tsx        # Team Details form (Create/Edit)
├── types/
│   └── react-beautiful-dnd.d.ts # DnD type definitions
├── App.tsx                     # Main app component with routing
├── index.css                   # Global styles and component styles
└── main.tsx                    # Application entry point
```

### Key Components

#### TeamListPage
- Displays teams in a responsive table
- Handles all CRUD operations
- Manages drag-and-drop reordering
- Controls master-detail expansion
- Inline member editing and deletion
- Search and bulk selection

#### TeamFormPage
- Create new teams or edit existing ones
- Team Details form with:
  - Team Name (required)
  - Team Description (required, multi-line)
  - Team Member table with columns:
    - Name (required, text input)
    - Gender (required, dropdown: Male/Female/Other)
    - Date of Birth (required, date picker)
    - Contact No. (required, numbers only, min 10 digits)
- MemberRow component for each team member
- Add New Member button to dynamically add rows
- Remove button for each member (min 1 member required)
- Comprehensive form validation with real-time error messages
- Confirmation dialogs for save and exit
- Loading states during API calls
- Data is fully editable when returning to the form

#### StatusControl
- Three-state circular status indicator
- Clickable to cycle through states
- Color-coded: gray (none), green (approved), red (rejected)
- Tooltip showing current status
- Auto-save on change

## 🚦 Getting Started

### Prerequisites
- Node.js 16+ installed
- Backend API running on `http://localhost:5000`

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 🔌 API Endpoints Expected

The application expects the following API endpoints:

- `GET /api/teams` - Get all teams
- `POST /api/teams` - Create new team
- `PUT /api/teams/:id` - Update team
- `DELETE /api/teams/:id` - Delete team
- `POST /api/teams/bulk-delete` - Delete multiple teams
- `PUT /api/teams/:id/status` - Update approval status
- `POST /api/teams/reorder` - Save team order
- `PUT /api/teams/:teamId/members/:memberId` - Update member
- `DELETE /api/teams/:teamId/members/:memberId` - Delete member

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🎯 Usage Guidelines

### Creating a Team
1. Click "New Team" button
2. Fill in required fields:
   - Team Name
   - Team Description
3. Add team members (at least one required):
   - Name
   - Gender (dropdown)
   - Date of Birth (date picker)
   - Contact Number (numbers only, min 10 digits)
4. Click "Add New Member" to add more members
5. Click "Save" button
6. Confirm the action to save

### Editing a Team
1. Click "Edit" button on any team row
2. Modify the fields as needed:
   - Update team name or description
   - Edit member details (name, gender, date of birth, contact)
   - Add new members using "Add New Member" button
   - Remove members using the ✕ button (minimum 1 member)
3. Click "Save" button
4. Confirm the action to update
5. Click "Exit" to cancel without saving (with confirmation)

### Deleting Teams
- **Single**: Click "Delete" button, confirm
- **Bulk**: Select checkboxes, click "Delete All", confirm

### Approving Teams
1. Click on the gray circle under "Approved by Manager" or "Approved by Director"
2. First click: Green checkmark (Approved)
3. Second click: Red cross (Not Approved)
4. Third click: Back to gray circle (No Action)
5. Status saves automatically

### Reordering Teams
1. Click and hold the drag handle (⋮⋮)
2. Drag team to desired position
3. Release to drop
4. Order saves automatically

### Managing Members
1. Click arrow button to expand team
2. Members appear below team row
3. Click "Edit" to modify member name
4. Click "Delete" to remove member
5. Changes save automatically

### Searching
- Type in search box
- Results filter in real-time
- Searches team names and member names

## 🎨 Customization

### Colors
Main colors can be customized in `src/index.css`:
- Primary blue: `#4299e1`
- Orange accent: `#f59e0b`
- Success green: `#48bb78`
- Error red: `#f56565`
- Gray neutral: `#cbd5e0`

### Styling
All styles are in `src/index.css` with clear section comments for easy modification.

## 📝 Notes

- Raw HTML tables are used (no DataTable libraries)
- All confirmations use native browser dialogs
- Toast notifications for success/error feedback
- TypeScript types defined inline in components
- Fully responsive with mobile-first approach
