"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import React from "react";

const Avatar = () => {
  const { data } = useSession();
  if (!data || !data.user) {
    return <p>Unauthorized</p>;
  }
  return (
    <div className="relative overflow-x-hidden rounded-full h-10 aspect-square">
      <Image
        src={data.user.image!}
        alt={data.user.name!}
        objectFit="cover"
        className="object-fill"
        layout="fill"
      />
    </div>
  );
};

export default Avatar;
