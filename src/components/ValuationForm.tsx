import { useState } from 'react';
import { valuationFields, FORM_ENDPOINT } from '../data/formConfig';
import type { FieldDef } from '../data/formConfig';
import './ValuationForm.css';

type Values = Record<string, string>;
type Errors = Record<string, string>;

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* Live form is a two-step Forminator wizard:
   step 1 = car details, step 2 = contact details, submit = "Send to Adam". */
const STEPS: string[][] = [
  ['car', 'condition', 'kilometres', 'location'],
  ['name', 'phone', 'email', 'notes'],
];

function validate(values: Values, names: string[]): Errors {
  const errs: Errors = {};
  for (const f of valuationFields) {
    if (!names.includes(f.name)) continue;
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

function Field({
  f,
  value,
  err,
  onChange,
}: {
  f: FieldDef;
  value: string;
  err?: string;
  onChange: (v: string) => void;
}) {
  const id = `vf-${f.name}`;
  return (
    <div className={`vform__field ${err ? 'has-error' : ''}`}>
      <label htmlFor={id}>
        {f.label}
        {f.required && <span className="vform__req" aria-hidden="true"> *</span>}
      </label>
      {f.type === 'select' ? (
        <select
          id={id}
          name={f.name}
          required={f.required}
          value={value || 'Select One'}
          aria-invalid={!!err}
          aria-describedby={err ? `${id}-err` : undefined}
          onChange={(e) => onChange(e.target.value)}
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
          value={value}
          aria-invalid={!!err}
          aria-describedby={err ? `${id}-err` : undefined}
          onChange={(e) => onChange(e.target.value)}
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
          value={value}
          aria-invalid={!!err}
          aria-describedby={err ? `${id}-err` : undefined}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
      {err && (
        <span className="vform__error" id={`${id}-err`}>
          {err}
        </span>
      )}
    </div>
  );
}

export default function ValuationForm() {
  const [values, setValues] = useState<Values>({ condition: 'Select One' });
  const [errors, setErrors] = useState<Errors>({});
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const set = (name: string, value: string) => {
    setValues((v) => ({ ...v, [name]: value }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: '' }));
  };

  const focusFirstError = () => {
    setTimeout(() => {
      document
        .querySelector<HTMLElement>(
          '.vform__field.has-error input, .vform__field.has-error select, .vform__field.has-error textarea'
        )
        ?.focus();
    }, 0);
  };

  const next = () => {
    const errs = validate(values, STEPS[0]);
    setErrors(errs);
    if (Object.keys(errs).length) return focusFirstError();
    setStep(1);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 0) return next();
    const errs = validate(values, STEPS[1]);
    setErrors(errs);
    if (Object.keys(errs).length) return focusFirstError();
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

  const stepFields = valuationFields.filter((f) => STEPS[step].includes(f.name));

  return (
    <form className="vform" onSubmit={onSubmit} noValidate aria-label="Car valuation request">
      {status === 'error' && (
        <p className="vform__alert" role="alert">
          Sorry, something went wrong sending your request. Please call Adam on{' '}
          <a href="tel:0404290617">0404 290 617</a>.
        </p>
      )}

      {/* progress bar, as on the live wizard */}
      <div className="vform__progress" aria-hidden="true">
        <span className="vform__progress-label">{step === 0 ? '0%' : '50%'}</span>
        <span className="vform__progress-track">
          <span className="vform__progress-fill" style={{ width: step === 0 ? '0%' : '50%' }} />
        </span>
      </div>
      <h3 className="vform__heading">{step === 0 ? 'Your car details' : 'Your contact details'}</h3>
      <p className="visually-hidden" aria-live="polite">
        Step {step + 1} of 2
      </p>

      {stepFields.map((f) => (
        <Field key={f.name} f={f} value={values[f.name] || ''} err={errors[f.name]} onChange={(v) => set(f.name, v)} />
      ))}

      <div className="vform__nav">
        {step === 1 && (
          <button type="button" className="vform__back" onClick={() => setStep(0)}>
            ← Back
          </button>
        )}
        {step === 0 ? (
          <button type="button" className="vform__submit" onClick={next}>
            Next
          </button>
        ) : (
          <button className="vform__submit" type="submit" disabled={status === 'submitting'}>
            {status === 'submitting' ? 'Sending…' : 'Send to Adam'}
          </button>
        )}
      </div>
    </form>
  );
}
