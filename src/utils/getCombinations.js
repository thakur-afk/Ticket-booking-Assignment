export function getCombinations(arr, k) {
  const results = [];

  function helper(start, path) {
    if (path.length === k) {
      results.push([...path]);
      return;
    }

    for (let i = start; i < arr.length; i++) {
      path.push(arr[i]);
      helper(i + 1, path);
      path.pop();
    }
  }

  helper(0, []);
  return results;
}
