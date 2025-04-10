import { Flex, Image } from "@chakra-ui/react"
import { Link } from "@tanstack/react-router"

import Logo from "../../assets/images/favicon.png"
import UserMenu from "./UserMenu"
import { useSidebar } from "../../providers/SidebarContext"

function Navbar() {

  const sidbarContext = useSidebar()

  return (
    <Flex
      justify="space-between"
      position="sticky"
      color="white"
      align="center"
      bg="bg.muted"
      w="100%"
      top={0}
      p={2}
    >

      <Flex align="center">
        <Link to="/">
          <Image src={Logo} alt="Logo" maxH="50px" p={1} />
        </Link>
      <Flex align="center">
        <sidbarContext.SideBarButton />
      </Flex>
      </Flex>
      <Flex gap={2} alignItems="center">
        <UserMenu />
      </Flex>
    </Flex>
  )
}

export default Navbar
