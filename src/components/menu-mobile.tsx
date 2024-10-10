import React, { useState } from "react";
import { Button, Drawer } from "antd";

export default function MenuMobile() {
  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <div className="md:hidden">
      <Button type="link" onClick={showDrawer}>
        <i className="fas fa-bars text-lg text-gray-700"></i>
        {/*<i className="fa-regular fa-bars-sort text-lg text-gray-700"></i>*/}
      </Button>
      <Drawer
        className="transition-transform"
        title="Basic Drawer"
        onClose={onClose}
        open={open}
        placement="left"
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Drawer>
    </div>
  );
}
