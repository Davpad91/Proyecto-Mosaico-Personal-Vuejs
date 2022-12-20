import { HierarchyDetail } from 'src/interfaces/app';

export const resolveHierarchy = (hierarchy: number): HierarchyDetail => {
  switch (hierarchy) {
    case 1:
      return {
        value: hierarchy,
        icon_type: 'material-icons',
        icon: 'shield',
        color: 'text-light-green-9',
      };
    case 2:
      return {
        value: hierarchy,
        icon_type: 'material-icons',
        icon: 'policy',
        color: 'text-amber-10',
      };
    case 3:
      return {
        value: hierarchy,
        icon_type: 'material-icons',
        icon: 'local_police',
        color: 'text-cyan-10',
      };
    case 4:
      return {
        value: hierarchy,
        icon_type: 'material-icons',
        icon: 'security',
        color: 'text-red-14',
      };
    default:
      return {
        value: hierarchy,
        icon_type: 'material-icons',
        icon: 'gpp_maybe',
        color: 'text-light-green-9',
      };
  }
};
