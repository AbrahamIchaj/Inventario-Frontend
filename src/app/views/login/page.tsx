import "../../../styles/bootstrap.css";
function BasicExample() {
  return (
    <form>
      <div className="mb-3">
        <label htmlFor="email" className="form-label">
          Email address
        </label>
        <input
          type="email"
          className="form-control"
          id="email"
          placeholder="Enter email"
        />
        <div className="form-text text-muted">
          We'll never share your email with anyone else.
        </div>
      </div>

      <div className="mb-3">
        <label htmlFor="password" className="form-label">
          Password
        </label>
        <input
          type="password"
          className="form-control"
          id="password"
          placeholder="Password"
        />
      </div>

      <div className="mb-3 form-check">
        <input type="checkbox" className="form-check-input" id="check" />
        <label className="form-check-label" htmlFor="check">
          Check me out
        </label>
      </div>

      <button type="submit" className="btn btn-danger">
        Submit
      </button>
    </form>
  );
}

export default BasicExample;
