import { useState } from 'react';
import './Register.css';

type PasswordStrength = 'weak' | 'medium' | 'strong' | '';

const getPasswordStrength = (password: string): PasswordStrength => {
  if (!password) return '';
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 1) return 'weak';
  if (score <= 3) return 'medium';
  return 'strong';
};

const strengthLabel: Record<PasswordStrength, string> = {
  weak: 'Seguridad baja · Usa mayúsculas y números',
  medium: 'Seguridad media · Añade símbolos para mejorarla',
  strong: 'Contraseña segura',
  '': '',
};

const strengthColor: Record<PasswordStrength, string> = {
  weak: '#e05252',
  medium: '#C9A84C',
  strong: '#4caf7d',
  '': 'transparent',
};

const Register = () => {
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    correo: '',
    password: '',
    confirmPassword: '',
    terms: false,
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);

  const passwordStrength = getPasswordStrength(form.password);

  const errors = {
    nombre: !form.nombre ? 'Campo requerido' : '',
    apellido: !form.apellido ? 'Campo requerido' : '',
    correo: !form.correo
      ? 'Campo requerido'
      : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo)
      ? 'Correo electrónico inválido'
      : '',
    password: !form.password ? 'Campo requerido' : '',
    confirmPassword:
      !form.confirmPassword
        ? 'Campo requerido'
        : form.confirmPassword !== form.password
        ? 'Debe coincidir con la contraseña anterior'
        : '',
    terms: !form.terms ? 'Debes aceptar los términos' : '',
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const showError = (field: string) =>
    (touched[field] || submitted) && errors[field as keyof typeof errors];

  const strengthPercent: Record<PasswordStrength, number> = {
    weak: 33,
    medium: 66,
    strong: 100,
    '': 0,
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    const hasErrors = Object.values(errors).some(Boolean);
    if (!hasErrors) {
      alert('¡Cuenta creada exitosamente!');
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        {/* Header */}
        <div className="register-header">
          <span className="register-eyebrow">NUEVO USUARIO</span>
          <h1 className="register-title">Crear cuenta</h1>
          <p className="register-subtitle">
            Regístrate para solicitar y dar seguimiento a tus eventos.
          </p>
        </div>

        {/* Step indicator */}
        <div className="step-indicator">
          <div className="step active" />
          <div className="step active" />
          <div className="step" />
        </div>

        {/* Form */}
        <form className="register-form" onSubmit={handleSubmit} noValidate>
          {/* Row 1 */}
          <div className="form-row">
            <div className={`field ${showError('nombre') ? 'has-error' : ''}`}>
              <label htmlFor="nombre">
                Nombre <span className="required">*</span>
              </label>
              <input
                id="nombre"
                name="nombre"
                type="text"
                placeholder="María"
                value={form.nombre}
                onChange={handleChange}
                onBlur={() => handleBlur('nombre')}
              />
              {showError('nombre') && <span className="error-msg">{errors.nombre}</span>}
            </div>

            <div className={`field ${showError('apellido') ? 'has-error' : ''}`}>
              <label htmlFor="apellido">
                Apellido <span className="required">*</span>
              </label>
              <input
                id="apellido"
                name="apellido"
                type="text"
                placeholder="González"
                value={form.apellido}
                onChange={handleChange}
                onBlur={() => handleBlur('apellido')}
              />
              {showError('apellido') && <span className="error-msg">{errors.apellido}</span>}
            </div>
          </div>


          {/* <div className="field">
            <label htmlFor="telefono">Teléfono</label>
            <input
              id="telefono"
              name="telefono"
              type="tel"
              placeholder="777 123 4567"
              value={form.telefono}
              onChange={handleChange}
            />
          </div> */}

          {/* Correo */}
          <div className={`field ${showError('correo') ? 'has-error' : ''}`}>
            <label htmlFor="correo">
              Correo electrónico <span className="required">*</span>
            </label>
            <input
              id="correo"
              name="correo"
              type="email"
              placeholder="maria.gonzalez@gmail.com"
              value={form.correo}
              onChange={handleChange}
              onBlur={() => handleBlur('correo')}
            />
            {showError('correo') && <span className="error-msg">{errors.correo}</span>}
          </div>

          {/* Password */}
          <div className={`field ${showError('password') ? 'has-error' : ''}`}>
            <label htmlFor="password">
              Contraseña <span className="required">*</span>
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Mínimo 8 caracteres"
              value={form.password}
              onChange={handleChange}
              onBlur={() => handleBlur('password')}
            />
            {form.password && (
              <div className="strength-wrapper">
                <div className="strength-bar">
                  <div
                    className="strength-fill"
                    style={{
                      width: `${strengthPercent[passwordStrength]}%`,
                      background: strengthColor[passwordStrength],
                    }}
                  />
                </div>
                <span
                  className="strength-label"
                  style={{ color: strengthColor[passwordStrength] }}
                >
                  {strengthLabel[passwordStrength]}
                </span>
              </div>
            )}
            {showError('password') && !form.password && (
              <span className="error-msg">{errors.password}</span>
            )}
          </div>

          {/* Confirm password */}
          <div className={`field ${showError('confirmPassword') ? 'has-error' : ''}`}>
            <label htmlFor="confirmPassword">
              Confirmar contraseña <span className="required">*</span>
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Repite tu contraseña"
              value={form.confirmPassword}
              onChange={handleChange}
              onBlur={() => handleBlur('confirmPassword')}
            />
            {showError('confirmPassword') && (
              <span className="error-msg">{errors.confirmPassword}</span>
            )}
          </div>

          {/* Terms */}
          {/* <div className={`field-checkbox ${showError('terms') ? 'has-error' : ''}`}>
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="terms"
                checked={form.terms}
                onChange={handleChange}
              />
              <span className="custom-checkbox" />
              <span className="checkbox-text">
                Acepto los{' '}
                <a href="#" className="link-gold">Términos y condiciones</a>
                {' '}y la{' '}
                <a href="#" className="link-gold">Política de privacidad</a>
                {' '}de iParty DJs.
              </span>
            </label>
            {showError('terms') && <span className="error-msg">{errors.terms}</span>}
          </div> */}

          {/* Submit */}
          <button type="submit" className="btn-register">
            Crear mi cuenta
          </button>

          {/* Login link */}
          <p className="login-link">
            ¿Ya tienes cuenta?{' '}
            <a href="/login" className="link-gold">Inicia sesión</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
