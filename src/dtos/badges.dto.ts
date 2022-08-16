import { IsString, IsNotEmpty, IsUUID, IsUrl, IsOptional, IsNumberString, IsIn } from 'class-validator';

export class CreateBadgeDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  public organization_id: string;

  @IsString()
  @IsNotEmpty()
  public badge_status: string;

  @IsString()
  @IsNotEmpty()
  public badge_name: string;

  @IsString()
  public badge_description: string;

  @IsString()
  @IsNotEmpty()
  @IsUrl()
  public badge_image_url: string;

  @IsString()
  public file_name: string;
}

export class ValidOrgIdDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  public organization_id: string;
}

export class GetBadgesQueryDto {
  @IsOptional()
  @IsString()
  @IsUUID()
  public organization_id: string;

  @IsOptional()
  @IsNumberString()
  public limit: string;

  @IsOptional()
  @IsNumberString()
  public offset: string;
}

export class AssignBadgeToMemberDto {
  @IsString()
  @IsUUID()
  public badge_id: string;

  @IsNumberString()
  public member_id: string;
}
export class VallidMemberIdDto {
  @IsNumberString()
  public member_id: string;
}

export class GetMemberBadgesQueryDto {
  @IsOptional()
  @IsString()
  @IsUUID()
  public organization_id: string;

  @IsOptional()
  @IsString()
  public tags: string;

  @IsOptional()
  @IsString()
  @IsIn(['all', 'in', 'notIn', 'any'])
  public tags_query_type: string;

  @IsOptional()
  @IsNumberString()
  public limit: string;

  @IsOptional()
  @IsNumberString()
  public offset: string;
}
