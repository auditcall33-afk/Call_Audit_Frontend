# Call Audit System - Technical Documentation

## Project Overview
The Call Audit System is a comprehensive web application designed for quality assurance (QA) teams to audit and evaluate customer support calls. The system enables QA auditors to assess agent performance based on predefined parameters, track audit acknowledgments, and generate performance reports.

---

## Tech Stack

### Frontend
- **Framework**: React 18.x
- **Language**: JavaScript (ES6+)
- **Routing**: React Router DOM (v6.x)
- **HTTP Client**: Axios
- **State Management**: React Hooks (useState, useEffect, useCallback)
- **UI Components**: Custom components with Lucide React icons
- **Styling**: CSS3 with CSS Variables for theming
- **Notifications**: React Toastify
- **PDF Generation**: jsPDF with AutoTable
- **Excel Export**: xlsx library
- **File Upload**: React Dropzone
- **Date Picker**: React Datepicker

### Backend
- **API**: RESTful API endpoints
- **Authentication**: JWT (JSON Web Tokens)
- **Data Format**: JSON

### Development Tools
- **Package Manager**: npm
- **Version Control**: Git
- **IDE Support**: VS Code / Windsurf

---

## System Architecture

### Frontend Architecture

```
src/
├── components/
│   ├── common/
│   │   ├── Card/
│   │   ├── Dropdown/
│   │   └── Modal/
│   ├── OtherInputsForm/
│   ├── ParametersForm/
│   └── ScoresSection/
├── pages/
│   ├── AgentDashboard/
│   │   ├── AgentProfile.jsx
│   │   ├── MyAudits.jsx
│   │   └── AgentReports.jsx
│   ├── QADashboard/
│   │   ├── AuditForm.jsx
│   │   ├── MyAuditsList.jsx
│   │   ├── QAProfile.jsx
│   │   ├── BulkUpload.jsx
│   │   └── QAReports.jsx
│   ├── Login.jsx
│   └── ProtectedRoute.jsx
├── services/
│   ├── authService.js
│   ├── auditService.js
│   └── userService.js
├── utils/
│   ├── pdfGenerator.js
│   └── excelGenerator.js
└── App.jsx
```

### Component Hierarchy

```
App (Router)
├── Login
├── ProtectedRoute (Role-based)
│   ├── Agent Dashboard
│   │   ├── Agent Profile
│   │   ├── My Audits (with Acknowledgment Modal)
│   │   └── Agent Reports
│   └── QA Dashboard (Tabbed)
│       ├── Tab 1: Audit Form
│       │   ├── Parameters Form
│       │   ├── Other Inputs Form
│       │   ├── Scores Section
│       │   └── Audit Summary
│       ├── Tab 2: My Audits List
│       │   ├── Audit Table
│       │   └── Audit Details Modal
│       ├── Tab 3: Bulk Upload
│       └── Tab 4: Reports
```

---

## Key Functionality

### 1. Authentication & Authorization
- **JWT-based Authentication**: Secure login with token storage
- **Role-based Access Control**: 
  - Agent Role: Can view audits, acknowledge, and view reports
  - QA Role: Can create, edit, reject audits, bulk upload, and view reports
- **Protected Routes**: Route guards to prevent unauthorized access

### 2. Audit Management (QA Dashboard)

#### Audit Creation
- **Parameter Evaluation**: 16 predefined parameters for call quality assessment
  - Call Opening
  - Listening Skills & Understanding
  - Empathy & Courtesy
  - Tone & Voice Modulation
  - Telephone Etiquettes
  - Language Skill
  - Call Closure
  - Probing Skills
  - System Check
  - Explanation/Adherence to Process SOP
  - Rebuttal Handling
  - Upselling Skills
  - Add-On Pitch
  - Right Information
  - Documentation/System/CRM Entries
  - Documentation/Order Related

- **Scoring System**:
  - Each parameter has YES/NO options with associated scores
  - Automatic calculation of:
    - Fatal Status (Yes/No)
    - Fatal Count (count of fatal parameters with NO value)
    - Scored (total score based on YES selections)
    - Scorable (fixed at 100)

- **Remark Fields**: Optional text fields for each parameter to provide detailed feedback

#### Audit Editing
- Edit existing audits when agents have acknowledged with "Not Satisfied"
- Pre-populate form with existing audit data
- Update audit with new evaluations

#### Audit Workflow
1. QA creates audit → Status: PENDING
2. Agent views audit → Can acknowledge as Satisfied or Not Satisfied
3. If Not Satisfied: Agent must provide comment
4. QA can:
   - Edit the audit (if acknowledgment is Not Satisfied)
   - Reject acknowledgment (if disagreement)
5. After QA action: Status → COMPLETED (Resolved)

### 3. Audit Acknowledgment (Agent Dashboard)

#### Acknowledgment Process
- Agents can view their assigned audits
- Acknowledge as:
  - **Satisfied**: No further action required
  - **Not Satisfied**: Mandatory comment field
- QA can view acknowledgment status and take action

#### Resolution Workflow
- When QA edits or rejects acknowledgment, audit status changes to COMPLETED
- Display shows "Resolved" status for completed acknowledgments

### 4. Bulk User Upload (QA Dashboard)
- Drag-and-drop Excel file upload
- Parse and validate user data
- Bulk create users via API
- Error handling and validation feedback

### 5. Reporting & Export

#### PDF Reports
- Generate performance reports in PDF format
- Include audit summaries, scores, and evaluation details
- Professional formatting with tables

#### Excel Export
- Export audit data to Excel format
- Filterable and sortable data
- Compatible with spreadsheet applications

### 6. Data Management

#### Audit Data Structure
```javascript
{
  agent_id: String,
  qa_id: Number,
  call_id: String,
  auditStatus: String, // PENDING, COMPLETED
  fatalStatus: String, // Yes, No
  fatalCount: Number,
  scored: Number,
  scorable: Number,
  // 16 parameter fields with remarks
  call_opening: String,
  call_opening_remark: String,
  // ... (other parameters)
}
```

#### User Data Structure
```javascript
{
  id: Number,
  username: String,
  role: String, // AGENT, QA
  agentId: String,
  // ... other user fields
}
```

---

## API Integration

### Authentication Service
- `login(username, password)` - Authenticate user and receive JWT
- `getCurrentUser()` - Get logged-in user details
- `logout()` - Clear session

### Audit Service
- `getAudits()` - Fetch all audits
- `getAuditById(id)` - Fetch single audit
- `getAuditsByAgentId(agentId)` - Fetch audits for specific agent
- `getAuditsByQaId(qaId)` - Fetch audits for specific QA
- `createAudit(auditData)` - Create new audit
- `updateAudit(id, auditData)` - Update existing audit
- `acknowledgeAudit(id, data)` - Agent acknowledges audit
- `rejectAcknowledgment(id, data)` - QA rejects acknowledgment

### User Service
- `getUsers()` - Fetch all users
- `bulkUpload(users)` - Bulk create users

---

## Data Flow

### Audit Creation Flow
```
QA fills Audit Form
↓
Parameter Selection (YES/NO)
↓
Automatic Score Calculation
↓
Validation (All fields required)
↓
Confirmation Modal
↓
POST /api/audits
↓
Audit Created (Status: PENDING)
```

### Acknowledgment Flow
```
Agent views My Audits
↓
Opens Audit Details Modal
↓
Selects Acknowledgment (Satisfied/Not Satisfied)
↓
If Not Satisfied: Enters comment
↓
PUT /api/audits/{id}/acknowledge
↓
QA views acknowledgment status
↓
QA can Edit or Reject
↓
Audit Status: COMPLETED (Resolved)
```

---

## Security Features

1. **JWT Authentication**: Token-based authentication for secure API access
2. **Role-based Access**: Separate dashboards for Agents and QA
3. **Protected Routes**: Route guards prevent unauthorized access
4. **Input Validation**: Required field validation before submission
5. **API Authorization**: Bearer token in request headers

---

## UI/UX Features

1. **Responsive Design**: Works on desktop and tablet devices
2. **Dropdown Menus**: User-friendly parameter selection with scores
3. **Modal Dialogs**: Confirmation modals and detail views
4. **Toast Notifications**: Real-time feedback for actions
5. **Loading States**: Visual feedback during async operations
6. **Collapsible Sections**: Expandable parameter remarks
7. **Status Badges**: Color-coded status indicators
8. **Sticky Sidebars**: Quick summary always visible

---

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Edge (latest)
- Safari (latest)

---

## Deployment Considerations

### Environment Variables
- `REACT_APP_API_BASE_URL`: Backend API base URL

### Build Process
```bash
npm install
npm start # Development
npm run build # Production build
```

### Production Optimization
- Code splitting for optimal loading
- Minified JavaScript bundles
- CSS optimization
- Asset compression

---

## Future Enhancements

1. **Real-time Notifications**: WebSocket for instant audit updates
2. **Advanced Analytics**: Performance trends and insights
3. **Mobile App**: React Native for mobile access
4. **Audio Recording Integration**: Attach call recordings to audits
5. **Custom Parameter Templates**: Configurable audit templates
6. **Multi-language Support**: Internationalization (i18n)
7. **Advanced Filtering**: Complex filter queries for audits
8. **Audit Templates**: Pre-defined templates for different call types

---

## Support & Maintenance

### Code Quality
- ESLint for code linting
- Consistent naming conventions (camelCase for JavaScript, snake_case for API)
- Component-based architecture for reusability
- Separation of concerns (UI, logic, services)

### Documentation
- Inline code comments
- Component documentation
- API endpoint documentation

---

## Contact Information

For technical support or inquiries, please contact the development team.

---

**Document Version**: 1.0  
**Last Updated**: April 22, 2026  
**Project Status**: Production Ready
