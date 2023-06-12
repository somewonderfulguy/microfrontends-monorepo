const App = () => {
  return (
    <div>
      <div>
        <label>
          <span>
            Fibonacci, <code>for</code> loop:
          </span>
          <input />
        </label>
      </div>
      <div>
        <label>
          <span>
            Fibonacci, <code>while</code> loop:
          </span>
          <input />
        </label>
      </div>
      <div>
        <label>
          <span>Fibonacci, recursion:</span>
          <input />
        </label>
        <div>
          <label>
            <span>Fibonacci, recursion with memoization:</span>
            <input />
          </label>
        </div>
      </div>
      <div>
        <label>
          <span>Fibonacci, recursion with memoization & promisification:</span>
          <input />
        </label>
      </div>
    </div>
  )
}

export default App
