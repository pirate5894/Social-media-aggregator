export function getData(posts: any) {
  const allPosts = posts.flatMap((page: any) => page.map((user: any) => user));
  return allPosts;
}

export function formatTimeAgo(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const yesterday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - 1
  );

  if (
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  ) {
    const diff = now.getTime() - date.getTime();

    if (diff < 3600000) {
      return `${Math.floor(diff / 60000)}m ago`;
    }
    return `${Math.floor(diff / 3600000)}h ago`;
  }
  if (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  ) {
    return "yesterday";
  }
  return `on ${date.getDate()}/${date.getMonth() + 1}`;
}
