import {
    Entity,
    Column,
    BaseEntity,
    PrimaryColumn,
    BeforeInsert,
    PrimaryGeneratedColumn,
} from "typeorm";
import { EquipmentStatusEnum } from "../models/EquipmentStatus";

@Entity("DataPoints")
export class DataPoint extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    primary!: number;

    @Column("nvarchar", { length: 255 })
    id!: string;

    @Column("nvarchar", { length: 255 })
    deveui!: string;

    @Column({ type: 'varchar', name: 'frota' })
    frota!: string;

    @Column("nvarchar", { length: 255 })
    op!: string;

    @Column("nvarchar", { length: 255 })
    stid!: string;

    @Column("nvarchar", { length: 255, nullable: true })
    status!: EquipmentStatusEnum;

    @Column("nvarchar", { length: 255, nullable: true })
    paired!: string | null;

    @Column("nvarchar", { length: 255 })
    categoria!: string;

    @Column("nvarchar", { length: 255 })
    operacao!: string;

    @Column("nvarchar", { length: 255 })
    Frente!: string;

    @Column("bigint")
    tst!: number;

    @Column("nvarchar", { length: 255 })
    tsd!: string;

    @Column("float")
    lat!: number;

    @Column("float")
    lon!: number;

    @Column("float")
    head!: number;

    @Column("float")
    speed!: number;

    @Column("int")
    rssi!: number;

    @Column("float")
    snr!: number;

    @Column("int")
    sf!: number;
}
