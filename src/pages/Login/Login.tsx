import { useState } from 'react';
import './Login.css';

const Login = () => {
  const [form, setForm] = useState({ correo: '', password: '' });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const [authError, setAuthError] = useState(false);
 // const [resetSent, setResetSent] = useState(false);

  const errors = {
    correo: !form.correo
      ? 'Campo requerido'
      : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo)
      ? 'Correo electrónico inválido'
      : '',
    password: !form.password ? 'Campo requerido' : '',
  };

  const showError = (field: string) =>
    (touched[field] || submitted) && errors[field as keyof typeof errors];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setAuthError(false);
  };

  const handleBlur = (field: string) =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    const hasErrors = Object.values(errors).some(Boolean);
    if (!hasErrors) {
      // Simula error de autenticación para demo
      setAuthError(true);
    }
  };

//   const handleReset = () => {
//     setResetSent(true);
//     setTimeout(() => setResetSent(false), 3000);
//   };

  return (
    <div className="login-page">
      <div className="login-card">

        {/* Header */}
        <div className="login-header">
          <span className="login-eyebrow">Bienvinido</span>
          <h1 className="login-title">Iniciar sesión</h1>
          <p className="login-subtitle">
            Ingresa tus datos para acceder a tu panel personal.
          </p>
        </div>

        {/* Form */}
        <form className="login-form" onSubmit={handleSubmit} noValidate>

          {/* Correo */}
          <div className={`field ${showError('correo') || authError ? 'has-error' : ''}`}>
            <label htmlFor="correo">
              Correo electrónico <span className="required">*</span>
            </label>
            <input
              id="correo"
              name="correo"
              type="email"
              placeholder="usuario@ejemplo.com"
              value={form.correo}
              onChange={handleChange}
              onBlur={() => handleBlur('correo')}
              autoComplete="email"
            />
            {showError('correo') && !authError && (
              <span className="error-msg">{errors.correo}</span>
            )}
          </div>

          {/* Contraseña */}
          <div className={`field ${showError('password') || authError ? 'has-error' : ''}`}>
            <div className="field-top-row">
              <label htmlFor="password">
                Contraseña <span className="required">*</span>
              </label>
           {/* <a href="/recuperar" className="forgot-link">¿Olvidaste tu contraseña?</a> */}
            </div>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Tu contraseña"
              value={form.password}
              onChange={handleChange}
              onBlur={() => handleBlur('password')}
              autoComplete="current-password"
            />
            {showError('password') && !authError && (
              <span className="error-msg">{errors.password}</span>
            )}
          </div>

          {/* Auth error alert */}
          {authError && (
            <div className="auth-error">
              <span className="auth-error-icon">!</span>
              Correo o contraseña incorrectos
            </div>
          )}

          {/* Submit */}
          <button type="submit" className="btn-login">
            Iniciar sesión
          </button>

{/*        
         <div className="separator">
            <span>o</span>
          </div>
          {/* Reset password 
          <button
            type="button"
            className="btn-reset"
            onClick={handleReset}
          >
            {resetSent ? '¡Correo enviado! Revisa tu bandeja' : 'Restablecer contraseña por correo'}
          </button> 
       */}

        </form>

        {/* Register link */}
        <p className="register-link">
          ¿Aún no tienes cuenta?{' '}
          <a href="/registro" className="link-gold">Regístrate gratis</a>
        </p>

      </div>
    </div>
  );
};

export default Login;