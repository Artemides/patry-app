import { useSession } from "next-auth/react";
import Image from "next/image";
import React from "react";

type AvatarProps = {
  name: string;
  image: string;
};

const Avatar = ({ image, name }: AvatarProps) => {
  return (
    <div className="relative overflow-x-hidden rounded-full h-10 aspect-square">
      <Image src={image} alt={name} className="object-fill" fill />
    </div>
  );
};

export default Avatar;
