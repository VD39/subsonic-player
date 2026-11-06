export function getRouteName(to: ToProp) {
  return (
    ((to && typeof to === 'object' && 'name' in to && to.name) as RouteName) ||
    undefined
  );
}
