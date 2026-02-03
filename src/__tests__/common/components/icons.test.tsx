import { render } from "@testing-library/react";

import {
  AppleIcon,
  BackArrowIcon,
  ChevronDownIcon,
  EyeIcon,
  EyeOffIcon,
  GoogleIcon,
  LoaderIcon,
  MailIcon,
  MenuIcon,
  MonitorIcon,
  MoonIcon,
  SunIcon,
  UserIcon,
} from "@/common/components/icons";

describe("Icons", () => {
  it("GoogleIcon renders svg with aria-hidden", () => {
    const { container } = render(<GoogleIcon />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute("aria-hidden");
  });

  it("GoogleIcon applies className", () => {
    const { container } = render(<GoogleIcon className="w-6" />);
    expect(container.querySelector("svg")).toHaveClass("w-6");
  });

  it("MailIcon renders svg", () => {
    const { container } = render(<MailIcon />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("BackArrowIcon renders without className prop", () => {
    const { container } = render(<BackArrowIcon />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("LoaderIcon renders with className", () => {
    const { container } = render(<LoaderIcon className="animate-spin" />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveClass("animate-spin");
  });

  it("EyeIcon and EyeOffIcon render", () => {
    const { container: c1 } = render(<EyeIcon />);
    const { container: c2 } = render(<EyeOffIcon />);
    expect(c1.querySelector("svg")).toBeInTheDocument();
    expect(c2.querySelector("svg")).toBeInTheDocument();
  });

  it("ChevronDownIcon renders", () => {
    const { container } = render(<ChevronDownIcon />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("MenuIcon renders", () => {
    const { container } = render(<MenuIcon />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("AppleIcon renders", () => {
    const { container } = render(<AppleIcon />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("UserIcon renders", () => {
    const { container } = render(<UserIcon />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("SunIcon, MoonIcon and MonitorIcon render", () => {
    const { container: c1 } = render(<SunIcon />);
    const { container: c2 } = render(<MoonIcon />);
    const { container: c3 } = render(<MonitorIcon />);
    expect(c1.querySelector("svg")).toBeInTheDocument();
    expect(c2.querySelector("svg")).toBeInTheDocument();
    expect(c3.querySelector("svg")).toBeInTheDocument();
  });
});
