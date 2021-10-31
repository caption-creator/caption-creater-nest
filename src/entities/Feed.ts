import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("feed", { schema: "CC" })
export class Feed {
  @PrimaryGeneratedColumn({ type: "int", name: "idx", unsigned: true })
  idx: number;

  @Column("varchar", { name: "user", length: 30 })
  user: string;

  @Column("varchar", { name: "feed", nullable: true, length: 30 })
  feed: string | null;

  @Column("timestamp", {
    name: "createTime",
    default: () => "CURRENT_TIMESTAMP",
  })
  createTime: Date;
}
