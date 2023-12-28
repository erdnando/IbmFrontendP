import { Guid } from "guid-typescript"
import { MUserEntity } from "./MUserEntity"
import { MAprobador } from "./MAprobador"

export interface MAprobadorUsuario {
  idAprobadorUsuario: Guid
  userEntityId: Guid
  userEntity: MUserEntity
  aprobadorId: Guid
  aprobador: MAprobador
}
