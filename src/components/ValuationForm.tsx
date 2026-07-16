import { useState } from 'react';
import { valuationFields, FORM_ENDPOINT } from '../data/formConfig';
import './ValuationForm.css';

type Values = Record<string, string>;
type Errors = Record<string, string>;

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values: Values): Errors {
  const errs: Errors = {};
  for (const f of valuationFields) {
    const v = (values[f.name] || '').trim();
    if (f.required && (!v || (f.type === 'select' && v === 'Select One'))) {
      errs[f.name] = 'This field is required';
      continue;
    }
    if (f.type === 'email' && v && !emailRe.test(v)) {
      errs[f.name] = 'Please enter a valid email address';
    }
    if (f.type === 'tel' && v && !/[0-9]/.test(v)) {
      errs[f.name] = 'Please enter a valid phone number';
    }
  }
  return errs;
}

export default function ValuationForm() {
  const [values, setValues] = useState<Values>({ condition: 'Select One' });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const set = (name: string, value: string) => {
    setValues((v) => ({ ...v, [name]: value }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: '' }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(values);
    setErrors(errs);
    if (Object.keys(errs).length) {
      const first = document.querySelector<HTMLElement>('.vform__field.has-error input, .vform__field.has-error select, .vform__field.has-error textarea');
      first?.focus();
      return;
    }
    setStatus('submitting');
    try {
      if (FORM_ENDPOINT) {
        const res = await fetch(FORM_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(values),
        });
        if (!res.ok) throw new Error('Request failed');
      } else {
        // No endpoint configured yet — simulate success (see src/data/formConfig.ts)
        await new Promise((r) => setTimeout(r, 600));
      }
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="vform vform--done" role="status" aria-live="polite">
        <div className="vform__check" aria-hidden="true">✓</div>
        <h3>Thank you!</h3>
        <p>
          Your details are on their way to Adam. He&rsquo;ll be in touch shortly with an
          obligation-free valuation. For anything urgent, call{' '}
          <a href="tel:0404290617">0404&nbsp;290&nbsp;617</a>.
        </p>
      </div>
    );
  }

  return (
    <form className="vform" onSubmit={onSubmit} noValidate aria-label="Car valuation request">
      {status === 'error' && (
        <p className="vform__alert" role="alert">
          Sorry, something went wrong sending your request. Please call Adam on{' '}
          <a href="tel:0404290617">0404 290 617</a>.
        </p>
      )}
      {valuationFields.map((f) => {
        const err = errors[f.name];
        const id = `vf-${f.name}`;
        return (
          <div className={`vform__field ${err ? 'has-error' : ''}`} key={f.name}>
            <label htmlFor={id}>
              {f.label}
              {f.required && <span className="vform__req" aria-hidden="true"> *</span>}
            </label>
            {f.type === 'select' ? (
              <select
                id={id}
                name={f.name}
                required={f.required}
                value={values[f.name] || 'Select One'}
                aria-invalid={!!err}
                aria-describedby={err ? `${id}-err` : undefined}
                onChange={(e) => set(f.name, e.target.value)}
              >
                {f.options!.map((o) => (
                  <option key={o} value={o} disabled={o === 'Select One'}>
                    {o}
                  </option>
                ))}
              </select>
            ) : f.type === 'textarea' ? (
              <textarea
                id={id}
                name={f.name}
                rows={4}
                placeholder={f.placeholder}
                value={values[f.name] || ''}
                aria-invalid={!!err}
                aria-describedby={err ? `${id}-err` : undefined}
                onChange={(e) => set(f.name, e.target.value)}
              />
            ) : (
              <input
                id={id}
                name={f.name}
                type={f.type}
                inputMode={f.type === 'tel' ? 'tel' : f.name === 'kilometres' ? 'numeric' : undefined}
                placeholder={f.placeholder}
                required={f.required}
                autoComplete={f.autoComplete}
                value={values[f.name] || ''}
                aria-invalid={!!err}
                aria-describedby={err ? `${id}-err` : undefined}
                onChange={(e) => set(f.name, e.target.value)}
              />
            )}
            {err && (
              <span className="vform__error" id={`${id}-err`}>
                {err}
              </span>
            )}
          </div>
        );
      })}

      <button className="vform__submit" type="submit" disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Submitting…' : 'Submit'}
      </button>
      <p className="vform__note">Obligation-free. No cost. No pressure.</p>
    </form>
  );
}
