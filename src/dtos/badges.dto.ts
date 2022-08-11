import { IsString, IsNotEmpty, IsUUID, IsUrl, IsOptional, IsNumberString } from 'class-validator';

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
