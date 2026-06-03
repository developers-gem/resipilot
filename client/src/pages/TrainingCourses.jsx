import { useState } from 'react';
import {
  useResource,
  PageHeader,
  Field,
} from '../components/ui.jsx';

export default function TrainingCourses() {
  const courses = useResource('/training-courses');

  const emptyForm = {
    name: '',
    description: '',
    requiredFor: '',
    validMonths: 12,
  };

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  async function saveCourse() {
    if (!form.name.trim()) {
      return alert('Course name is required');
    }

    if (!form.validMonths) {
      return alert('Valid months is required');
    }

    try {
      setSaving(true);

      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        requiredFor: form.requiredFor
          ? form.requiredFor
            .split(',')
            .map(x => x.trim())
            .filter(Boolean)
          : [],
        validMonths: Number(form.validMonths),
      };

      if (editingId) {
        await courses.update(editingId, payload);
      } else {
        await courses.create(payload);
      }

      setForm(emptyForm);
      setEditingId(null);

      courses.refresh();
    } catch (err) {
      alert(
        err?.message ||
        'Unable to save course'
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteCourse(id, name) {
    const ok = window.confirm(
      `Delete "${name}"?`
    );

    if (!ok) return;

    try {
      await courses.remove(id);
      courses.refresh();
    } catch {
      alert('Unable to delete course');
    }
  }

  function editCourse(course) {
    setEditingId(course._id);

    setForm({
      name: course.name || '',
      description:
        course.description || '',
      requiredFor:
        course.requiredFor?.join(', ') ||
        '',
      validMonths:
        course.validMonths || 12,
    });

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
  }

  return (
    <>
      <PageHeader
        title="Training Certificates"
      />

      <div
        className="card"
        style={{
          marginBottom: 20,
        }}
      >
        <h3
          style={{
            marginBottom: 18,
          }}
        >
          {editingId
            ? 'Edit Course'
            : 'Add Course'}
        </h3>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit,minmax(280px,1fr))',
            gap: 18,
          }}
        >
          <Field label="Course Name *">
            <input
              value={form.name}
              placeholder="CPR"
              onChange={e =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
            />
          </Field>

          <Field label="Valid Months *">
            <input
              type="number"
              min="1"
              value={form.validMonths}
              onChange={e =>
                setForm({
                  ...form,
                  validMonths:
                    e.target.value,
                })
              }
            />
          </Field>

          <div
            style={{
              gridColumn: '1/-1',
            }}
          >
            <Field label="Description">
              <textarea
                rows="3"
                value={form.description}
                placeholder="Course description..."
                onChange={e =>
                  setForm({
                    ...form,
                    description:
                      e.target.value,
                  })
                }
              />
            </Field>
          </div>

          <div
            style={{
              gridColumn: '1/-1',
            }}
          >
            <Field label="Required For">
              <input
                placeholder="Caregiver, Nurse, Manager"
                value={form.requiredFor}
                onChange={e =>
                  setForm({
                    ...form,
                    requiredFor:
                      e.target.value,
                  })
                }
              />
            </Field>

            <div
              style={{
                marginTop: 6,
                fontSize: 12,
                color: '#666',
              }}
            >
              Separate multiple roles
              with commas.
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            gap: 10,
            marginTop: 20,
          }}
        >
          <button
            className="btn primary"
            onClick={saveCourse}
            disabled={saving}
          >
            {editingId
              ? 'Update Course'
              : 'Add Course'}
          </button>

          {editingId && (
            <button
              className="btn ghost"
              onClick={cancelEdit}
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Course</th>
              <th>Description</th>
              <th>Required For</th>
              <th>Valid Months</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {courses.items.map(course => (
              <tr key={course._id}>
                <td>
                  <strong>
                    {course.name}
                  </strong>
                </td>

                <td>
                  {course.description ||
                    '-'}
                </td>

                <td>
                  {course.requiredFor?.length
                    ? course.requiredFor.join(
                      ', '
                    )
                    : '-'}
                </td>

                <td>
                  {course.validMonths}
                </td>

                <td>
                  <div
                    style={{
                      display: 'flex',
                      gap: 8,
                    }}
                  >
                    <button
                      className="btn sm"
                      onClick={() =>
                        editCourse(course)
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="btn danger sm"
                      onClick={() =>
                        deleteCourse(
                          course._id,
                          course.name
                        )
                      }
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {!courses.items.length && (
              <tr>
                <td
                  colSpan="5"
                  style={{
                    textAlign: 'center',
                    padding: 30,
                    color: '#666',
                  }}
                >
                  No training Certificates found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}