import { HiOutlineMenu } from '@react-icons/all-files/hi/HiOutlineMenu'

export const MenuLauncher = ({ onClick }: { onClick: () => any }) => (
  <button
    onClick={onClick}
    className="absolute md:hidden text-slate-200 top-2 right-2"
  >
    <HiOutlineMenu className="w-8 h-8" />
  </button>
)
