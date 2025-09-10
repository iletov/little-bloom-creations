import { Button } from '@/components/ui/button';
import { SignInButton, SignOutButton, useUser } from '@clerk/nextjs';
import { LogOutIcon } from 'lucide-react';
import { LoginIcon } from '../icons/icons';

export const UserActions = ({
  onLinkClickAction,
}: {
  onLinkClickAction: () => void;
}) => {
  const { user } = useUser();
  return (
    <div className="flex gap-3 z-50">
      {user ? (
        <>
          <SignOutButton>
            <Button
              variant={'outline'}
              onClick={onLinkClickAction}
              className="bg-transparent hover:bg-transparent rounded-full w-16 h-16 border-secondaryPurple ">
              <LogOutIcon size={24} className="!w-6 !h-6 text-darkGold" />
            </Button>
          </SignOutButton>
        </>
      ) : (
        <SignInButton mode="modal">
          <Button
            variant={'outline'}
            onClick={onLinkClickAction}
            className="bg-transparent hover:bg-transparent rounded-full w-16 h-16 border-secondaryPurple">
            <LoginIcon className="!w-6 !h-6 text-darkGold" />
          </Button>
        </SignInButton>
      )}
    </div>
  );
};
