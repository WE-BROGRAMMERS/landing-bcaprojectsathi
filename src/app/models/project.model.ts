export interface ProjectBadge {
  text: string;
  type: string;
}

export interface ProjectSpec {
  icon: string;
  label: string;
}

export interface Project {
  id: string;
  image: string;
  alt: string;
  badge: ProjectBadge;
  title: string;
  price: string;
  description: string;
  specs: ProjectSpec[];
  url: string;
  galleryCount: number;
  category: string;
  semester: string;
  complexity: string;
  gallery: string[];
}